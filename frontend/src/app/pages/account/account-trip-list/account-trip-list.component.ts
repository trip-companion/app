import { Component, Inject, Input, ViewEncapsulation, ChangeDetectionStrategy,
         ChangeDetectorRef, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { StateService } from '@app/services/state.service';
import { Observable, Subscription } from 'rxjs';

import { IUserTrip } from '@app/interfaces/store/userTripList';

import { LocationService } from '@app/services/location.service';
import { SharedService } from '@app/services/shared.service';

import { AppState , getTripList } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import IUserModel from '@app/interfaces/store/user';
import { ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'account-trip-list',
  templateUrl:'./account-trip-list.component.html',
  styleUrls: ['./account-trip-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AccountTripListComponent implements OnInit, OnDestroy {
    @Input() public user: IUserModel;
    public tripList$: Observable<IUserTrip[]> = this.store.select(getTripList);
    public sizeArticlesInPage: number;
    public pageNum: number;

    private isBrowser: boolean;
    private clientWidth = this.document.documentElement.clientWidth;
    private subsRouteData: Subscription = new Subscription();

    constructor(@Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: any,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public locationService: LocationService,
        public sharedService: SharedService,
        private store: Store<AppState>,
        public stateService: StateService,) {
      this.isBrowser = isPlatformBrowser(platformId);
    };

    public ngOnInit(): void {

      this.subsRouteData = this.route.data.subscribe((data: Data) => {
        // this.pageNum = data.tripListPageNum;
        console.log(data)
        // const OFFSET: number = (this.pageNum * 6 - 6) + this.APPS.newsStaticOffset;
        // const LIMIT: number = this.APPS.news.length - OFFSET < 6 ? this.APPS.news.length - OFFSET : 6;
        // this.newsItems = this.APPS.news.slice(OFFSET, OFFSET + LIMIT);
        // this.paginationInstance = {currentPage: this.pageNum, itemsPerPage: 6, totalItems: this.APPS.news.length - 1};
      });

      if(this.clientWidth >= 1200) {
        this.sizeArticlesInPage = 9;
      } else if(this.clientWidth >= 770 && this.clientWidth <= 1200) {
        this.sizeArticlesInPage = 6;
      } else {
        this.sizeArticlesInPage = 5;
      };

    }

    public ngOnDestroy(): void {
      this.subsRouteData.unsubscribe();
    };
  /////////////////////////////////////////////////////////////////

};
