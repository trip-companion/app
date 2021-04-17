import { Component, Inject, Input, ViewEncapsulation, ChangeDetectionStrategy,
         ChangeDetectorRef, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StateService } from '@app/services/state.service';
import { Observable } from 'rxjs';

import { IUserTrip } from '@app/interfaces/store/userTripList';

import { LocationService } from '@app/services/location.service';
import { SharedService } from '@app/services/shared.service';

import { AppState , getTripList } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import IUserModel from '@app/interfaces/store/user';


@Component({
  selector: 'account-trip-list',
  templateUrl:'./account-trip-list.component.html',
  styleUrls: ['./account-trip-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class AccountTripListComponent implements OnInit, OnDestroy {
    @Input() public user: IUserModel;
    public tripList$: Observable<IUserTrip[]> = this.store.select(getTripList);
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any,
        private cdr: ChangeDetectorRef,
        public locationService: LocationService,
        public sharedService: SharedService,
        private store: Store<AppState>,
        public stateService: StateService,) {
      this.isBrowser = isPlatformBrowser(platformId);
    };

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {

    };
  /////////////////////////////////////////////////////////////////

};
