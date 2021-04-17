import { Component, Inject, Input, ViewEncapsulation, ChangeDetectionStrategy,
         ChangeDetectorRef, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StateService } from '@app/services/state.service';

import { IUserTrip } from '@app/interfaces/store/userTripList';
import IUserModel from '@app/interfaces/store/user';

import { LocationService } from '@app/services/location.service';
import { SharedService } from '@app/services/shared.service';

import { AppState } from '@app/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'account-trip-card',
  templateUrl:'./account-trip-card.component.html',
  styleUrls: ['./account-trip-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class AccountTripCardComponent implements OnInit, OnDestroy {
    @Input() public tripData: IUserTrip;
    @Input() public user: IUserModel;
    public availableUserCategories: {id: string; displayName: string}[] = [
      {
        id: '1',
        displayName: 'sport'
      },
      {
        id: '2',
        displayName: 'Language practice'
      },
      {
        id: '3',
        displayName: 'Excursions'
      },
      {
        id: '4',
        displayName: 'Wine tasting'
      },
    ];
    public maxDiscriptionCard = true;
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
      // console.log(this.tripData);
      // console.log(this.user)
      if(this.tripData.travelDescription.length > 200) {this.maxDiscriptionCard = false;}
    }


    public ngOnDestroy(): void {

    };
    /////////////////////////////////////////////////////////////////

    public showMoreText(): void {
      this.maxDiscriptionCard = !this.maxDiscriptionCard;
    }

};
