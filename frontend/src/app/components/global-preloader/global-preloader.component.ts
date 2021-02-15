import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation,
	Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
//services
import { SharedService } from '@app/services/shared.service';

import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';

@Component({
  selector: 'global-preloader',
  templateUrl: './global-preloader.component.html',
  styleUrls: ['./global-preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class GlobalPreloaderComponent implements OnInit, AfterViewInit, OnDestroy {

	public homePath: string;
	public modelLang: string;
	public isMatSelectOpen: boolean = false;
	private isViewInited = false;
	public userActive: boolean;
	private preloader =  this.document.getElementsByTagName('global-preloader')[0] as HTMLElement;
	private subsGlobalEventStore: Subscription = new Subscription();

	constructor(@Inject(DOCUMENT) private document: Document,
		private cdRef: ChangeDetectorRef,
		public sharedService: SharedService,
		private store: Store<AppState>,) {
	}

	public ngOnInit(): void {
		this.preloader.classList.add('off');
		this.subsGlobalEventStore = this.store.select('globalEvent').subscribe(({loadingPageContent}) => {
			loadingPageContent?this.preloader.classList.remove('off'):this.preloader.classList.add('off');
		})
	}

	public ngAfterViewInit(): void {

	};

	public ngOnDestroy(): void {

	};

};
