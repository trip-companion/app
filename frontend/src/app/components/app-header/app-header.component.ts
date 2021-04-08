import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation,
         Inject, ChangeDetectorRef, AfterViewInit, OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router, Data, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
// services
import { SharedService } from '@app/services/shared.service';
import { LocationService } from '../../services/location.service';
import { StateService } from '../../services/state.service';
import { AuthenticationService } from '@app/services/authentication.service';

import { ROUTER_CONFIG, ACCOUNT_LINK_LIST, LOGOUT_NAME } from '@app/DATA/router.config';
import { IRouteConfig } from '@app/interfaces/route-config';
import { Store } from '@ngrx/store';
import { AppState, getUserAvatar } from '@app/store/app.state';


@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hamburger', {static: false}) public hamburger: ElementRef;
  @ViewChild('headerNav', {static: false}) public headerNav: ElementRef;
  @ViewChild('overlay', {static: false}) public overlay: ElementRef;

  public accountLinkConfig: IRouteConfig[] = [];
  public mainLinkConfig: IRouteConfig[] = [];
  public homePath: string;
  public modelLang: string;
  public userActive: boolean;
  public logoutName: string;
  public userAvatar$: Observable<string | null>;

  public isMatSelectOpen = false;
  private isViewInited = false;
  private subsRouter: Subscription = new Subscription();
  private subsChangeRouterData: Subscription = new Subscription();
  private subsLoginStatus: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store<AppState>,
    private authSvc: AuthenticationService,
    public locationService: LocationService,
    private stateService: StateService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    public sharedService: SharedService,) {
    this.linkConfigFilter(ROUTER_CONFIG, ACCOUNT_LINK_LIST);
    this.logoutName = LOGOUT_NAME[this.sharedService.language];
  }

  public ngOnInit(): void {
    this.modelLang = this.sharedService.language;
    this.userAvatar$ = this.store.select(getUserAvatar);
    this.subsLoginStatus = this.authSvc.token.subscribe((token: string) => {
      this.userActive = token ? true : false;
      this.cdRef.detectChanges();
    });

    this.subsChangeRouterData = this.stateService.updateRouterData$.subscribe((data: Data) => {
      if (this.stateService.isBrowser) {
        console.groupCollapsed(`%c HeaderComponent:updateRouterData$`, 'color:green;font-size:12px;');
        console.groupEnd();
      }
      this.logoutName = LOGOUT_NAME[this.sharedService.language];
      this.homePath = this.locationService.extractBasePATH();
      if (this.isViewInited) { this.cdRef.detectChanges(); }
    });
    this.subsRouter = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && this.isViewInited) { this.cdRef.detectChanges(); }
    });
  }

  public ngAfterViewInit(): void {

    this.isViewInited = true;
    this.stateService.toggleSidebar$.subscribe((condition) => {
      this.toggleSidebar(condition);
    });
  }

  public ngOnDestroy(): void {
    this.subsLoginStatus.unsubscribe();
    this.subsRouter.unsubscribe();
    this.subsChangeRouterData.unsubscribe();
  }

  public toggleSidebar(t: boolean): void {
    const T = `${t ? `add` : `remove`}Class`;
    this.renderer[T](this.hamburger.nativeElement, `open`);
    this.renderer[T](this.headerNav.nativeElement, `open`);

    this.renderer[T](this.overlay.nativeElement, `show-overlay`);

    if (this.stateService.isBrowser) {
      if(this.stateService.deviceInfo.browser === 'firefox' && this.stateService.deviceInfo.browserVersion >= 71) {return;}
      this.renderer[T](this.document.body, `noscroll`);
    };
  }

  public goHome(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate([this.homePath]);
  }

  public onOpenedChange(event: boolean): any {
    this.isMatSelectOpen = event;
    if (this.isMatSelectOpen) {
      this.document.getElementsByClassName('cdk-overlay-pane')[0].classList.add('lang-overplay-pane');
    } else {
      this.document.getElementsByClassName('cdk-overlay-pane')[0].classList.remove('lang-overplay-pane');
    }
    this.cdRef.detectChanges();
  }

  public preventLink(event: MouseEvent, lang: string): void {
    this.router.navigate([this.locationService.getLocalizationPathWith(lang)]);
    event.preventDefault();
  }

  public logout(): void {
    this.authSvc.logout();
  }

  public linkConfigFilter(routerConfig: IRouteConfig[], accoutnLink: string[]): any {
    this.mainLinkConfig = routerConfig.filter(rout => {
      const findAccountRout = accoutnLink.find(pageUrl => rout.url === pageUrl);
      return !findAccountRout ? rout.mainMenu?true:false : !this.accountLinkConfig.push(rout);
    });
  }

}
