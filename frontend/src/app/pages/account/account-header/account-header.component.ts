import { Component, Inject, Input, ViewEncapsulation, ChangeDetectionStrategy,
         ChangeDetectorRef, AfterViewInit, PLATFORM_ID, ViewChild, ElementRef, OnInit,
         OnDestroy, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StateService } from '@app/services/state.service';

import IUserModel from '@app/interfaces/store/user';
import IPageDataModel from '@app/interfaces/store/pageData';

import { LocationService } from '@app/services/location.service';
import { ApiService } from '@app/services/api.services';
import { SharedService } from '@app/services/shared.service';

import { UpdateUserLocalAction } from '@app/store/actions/user.action';
import { AppState } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '@app/models/user.model';

@Component({
  selector: 'account-header',
  templateUrl:'./account-header.component.html',
  styleUrls: ['./account-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class AccountHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('fileInput') public fileInput: ElementRef;
    @Input() public content: IPageDataModel;
    @Input() public user: IUserModel;
    @Input() public globalEventSuccess: string[];
    @Input() public globalEventError: string[];
    @Output() changeAccountPage = new EventEmitter<string>();

    public cardHeader = '/assets/images/account/account_card_head.jpg';
    public pageName: string;

    private isBrowser: boolean;

    private subsRouteData: Subscription = new Subscription();

    constructor(@Inject(PLATFORM_ID) private platformId: any,
        private cdr: ChangeDetectorRef,
        public locationService: LocationService,
        public sharedService: SharedService,
        private store: Store<AppState>,
        private activeRoute: ActivatedRoute,
        private apiSvc: ApiService,
        public stateService: StateService,) {
      this.isBrowser = isPlatformBrowser(platformId);
    };

    public ngOnInit(): void {
      this.subsRouteData = this.activeRoute.data.subscribe((data: Data) => {
        this.pageName = `${data.page}${!!data.subpage ? `${data.subpage}` : ''}`;
        this.changeAccountPage.next(this.pageName);
      });
    }
    public ngAfterViewInit(): void {
      if (this.isBrowser) {
        this.cdr.detectChanges();
      };
    };

    public ngOnDestroy(): void {
      this.subsRouteData.unsubscribe();
    };
    /////////////////////////////////////////////////////////////////

    public uploadAvatar(event: InputEvent) {
      const imgFile = event.target as HTMLInputElement;
      if (imgFile.files && imgFile.files[0]) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;

          image.onload = (rs: any) => {
            const height = rs.path[0].naturalHeight;
            const width = rs.path[0].naturalWidth;

            if (height > 750 || width > 750) {
              this.sharedService.setGlobalEventData(this.globalEventError[9], 'error-window');
              this.fileInput.nativeElement.value = '';
              return false;
            };
            this.apiSvc.postUserAvatar(imgFile.files[0])
              .subscribe((updatedUser: IUserModel) => {
                const userDTO = new UserModel(updatedUser);
                this.store.dispatch(new UpdateUserLocalAction(userDTO));
                this.sharedService.setGlobalEventData(this.globalEventSuccess[0], 'success-window');
              }, error => console.log(error));
          };
          image.onerror = () => {
            this.sharedService.setGlobalEventData(this.globalEventError[10], 'error-window');
            this.fileInput.nativeElement.value = '';
            return false;
          };
        };
        reader.readAsDataURL(imgFile.files[0]);
      } else {
        this.sharedService.setGlobalEventData(this.globalEventError[11], 'error-window');
      };
    };
};
