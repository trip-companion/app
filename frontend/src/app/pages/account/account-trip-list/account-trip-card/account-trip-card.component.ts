import { Component, Inject, Input, ViewEncapsulation, ChangeDetectionStrategy,
         ChangeDetectorRef, PLATFORM_ID, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StateService } from '@app/services/state.service';

import IUserModel from '@app/interfaces/store.models/user.model';
import IPageDataModel from '@app/interfaces/store.models/pageData.model';

import { LocationService } from '@app/services/location.service';
import { ApiService } from '@app/services/api.services';
import { SharedService } from '@app/services/shared.service';

import { AppState } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'account-trip-card',
  templateUrl:'./account-trip-card.component.html',
  styleUrls: ['./account-trip-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class AccountTripCardComponent implements OnInit, OnDestroy {
    // @ViewChild('fileInput') fileInput: ElementRef;
    // @Input('content') contentData: IPageDataModel;
    // @Input('user') userData: IUserModel;
    // @Input('cardUser') cardUser: string;
    // @Input('globalEventSuccess') globalEventSuccess: string[];
    // @Input('globalEventError') globalEventError: string[];
    public fakeContent = `The Himalayas is a mountain range in Asia. The Himalayas is a mountain range in Asia.
    The Himalayas is a mountain range in Asia.
    The Himalayas is a mountain range in Asia. The Himalayas is a mountain range in Asia.
    The Himalayas is a mountain range in Asia.`;
    public maxDiscriptionCard = true;
    private isBrowser: boolean;

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
      if(this.fakeContent.length > 200) {this.maxDiscriptionCard = false;}
    }


    public ngOnDestroy(): void {

    };
    /////////////////////////////////////////////////////////////////

    public showMoreText(): void {
      this.maxDiscriptionCard = !this.maxDiscriptionCard;
    }

};
