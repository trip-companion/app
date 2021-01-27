import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Renderer2,
	Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, Data, NavigationEnd } from '@angular/router'
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
//services
import { SharedService } from '../../services/shared.service';
import { LocationService } from '../../services/location.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

	public homePath: string;
	public modelLang: string;
	public isMatSelectOpen: boolean = false;
	private isViewInited = false;

	private subsRouter: Subscription = new Subscription();
	private subsChangeRouterData: Subscription = new Subscription();

	constructor(@Inject(DOCUMENT) private document: Document,
				private router: Router,
				public locationService: LocationService,
				private renderer: Renderer2,
				private stateService: StateService,
				private cdRef: ChangeDetectorRef,
				public sharedService: SharedService,) {
	}

	public ngOnInit(): void {
		this.modelLang = this.sharedService.language;
		
		this.subsChangeRouterData = this.stateService.updateRouterData$.subscribe((data: Data) => {
			if (this.stateService.isBrowser) {
				console.groupCollapsed(`%c HeaderComponent:updateRouterData$`, 'color:green;font-size:12px;');
				console.groupEnd();
			}
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

};
