import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation,
	Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, Data, NavigationEnd } from '@angular/router'
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
//services
import { SharedService } from '../../services/shared.service';
import { LocationService } from '../../services/location.service';
import { StateService } from '../../services/state.service';
import { AuthenticationService } from '@app/services/authentication.service';

import { ROUTER_CONFIG, ACCOUNT_LINK_LIST, LOGOUT_NAME } from '@app/DATA/router.config';
import IRouteConfig from "@app/interfaces/route-config";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	public accountLinkConfig: IRouteConfig[] = [];
	public mainLinkConfig: IRouteConfig[] = [];
	public homePath: string;
	public modelLang: string;
	public isMatSelectOpen: boolean = false;
	private isViewInited = false;
	public userActive: boolean;
	public logoutName: string;

	private subsRouter: Subscription = new Subscription();
	private subsChangeRouterData: Subscription = new Subscription();
	private subsLoginStatus: Subscription = new Subscription();

	constructor(@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private authSvc:  AuthenticationService,
		public locationService: LocationService,
		private stateService: StateService,
		private cdRef: ChangeDetectorRef,
		public sharedService: SharedService,) {
			this.linkConfigFilter(ROUTER_CONFIG, ACCOUNT_LINK_LIST);
			this.logoutName = LOGOUT_NAME[this.sharedService.language]
	}

	public ngOnInit(): void {
		this.modelLang = this.sharedService.language;
		this.subsLoginStatus = this.authSvc.token.subscribe((token: string) => {
			this.userActive = token?true:false;
			this.cdRef.detectChanges();
		});

		this.subsChangeRouterData = this.stateService.updateRouterData$.subscribe((data: Data) => {
			if (this.stateService.isBrowser) {
				console.groupCollapsed(`%c HeaderComponent:updateRouterData$`, 'color:green;font-size:12px;');
				console.groupEnd();
			}
			this.logoutName = LOGOUT_NAME[this.sharedService.language]
			this.homePath = this.locationService.extractBasePATH();
			if (this.isViewInited) { this.cdRef.detectChanges(); }
		});
		this.subsRouter = this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd && this.isViewInited) { this.cdRef.detectChanges(); }
		});
	}

	public ngAfterViewInit(): void {

	};

	public ngOnDestroy(): void {
		this.subsLoginStatus.unsubscribe();
		this.subsRouter.unsubscribe();
		this.subsChangeRouterData.unsubscribe();
	};

	public goHome(event: MouseEvent): void {
		event.preventDefault();
		this.router.navigate([this.homePath]);
	};

	public onOpenedChange(event: boolean): any {
		this.isMatSelectOpen = event;
		if(this.isMatSelectOpen) this.document.getElementsByClassName('cdk-overlay-pane')[0].classList.add("lang-overplay-pane");
		this.cdRef.detectChanges();
	};

	public preventLink(event: MouseEvent, lang: string): void {
		this.router.navigate([this.locationService.getLocalizationPathWith(lang)]);
		event.preventDefault();
	};

	public logout()  {
		this.authSvc.logout();
	};

	public linkConfigFilter(routerConfig:IRouteConfig[], accoutnLink: Array<string>) {
		this.mainLinkConfig = routerConfig.filter(rout => {
			const findAccountRout = accoutnLink.find(pageUrl => rout.url === pageUrl)
			return !findAccountRout? true : !this.accountLinkConfig.push(rout)
		});
	}

};
