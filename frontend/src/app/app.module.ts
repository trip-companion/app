import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject, PLATFORM_ID, APP_ID, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { DeviceDetectorService } from 'ngx-device-detector';
// services
import { SharedService } from './services/shared.service';
import { LocationService } from './services/location.service';
import { SsrRedirectService } from '@app/services/SsrRedirect.service';
import { StateService } from './services/state.service';
// global  module
import { GlobalPreloaderModule } from './components/global-preloader/global-preloader.module';
import { GlobalEventModule } from './components/global-event/global-event.module';
import { HeaderModule } from './components/app-header/app-header.module';
// guards
import { LanguageResolver } from './guards/language.resolver';
import { PageResolver } from './guards/page.resolver';
import { PageDataResolver } from './guards/pageData.resolver';
import { ResolverService } from './services/resolver.service';
// component
import { Redirect301Component } from './components/redirect301/redirect301.component';
import { reducers } from '@app/store/app.state';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationService } from './services/authentication.service';
// Interceptor
import { BasicAuthInterceptor } from '@app/helpers/basic-auth.inerceptor';
import { ErrorInterceptor } from '@app/helpers/error.interceptor';
import { SetHeaderInterceptor } from '@app/helpers/header.inerceptor';
import { InjectionToken } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    Redirect301Component
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(),
    GlobalPreloaderModule,
    HeaderModule,
    GlobalEventModule,
  ],
  providers: [
    SharedService,
    StateService,
    LanguageResolver,
    LocationService,
    SsrRedirectService,
    PageResolver,
    ResolverService,
    PageDataResolver,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SetHeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  private lazyStyles: string[] = [
    // `lazy-style.css`,
  ];

  constructor(@Inject(DOCUMENT) private document: Document,
              @Inject(PLATFORM_ID) private platformId: any,
              @Inject(APP_ID) private appId: string,
              public ss: StateService,
              private dds: DeviceDetectorService,
              private authService: AuthenticationService,) {
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);

    this.ss.isBrowser = isPlatformBrowser(platformId);
    this.ss.appId = appId;

    if (isPlatformBrowser(platformId)) {
      this.detectDevice();
      this.authService.setTokenValue = localStorage.getItem('accessToken');
      if (!isDevMode()) {
        // Include Lazy Style to <head> only
        this.lazyStyles.forEach((href: string) => this.loadStyle(href, false));
      }
    }
  }

  private loadStyle(href: string, preload: boolean): void {
    const L: HTMLLinkElement = this.document.createElement(`link`);
    if (preload) {
      L.setAttribute(`rel`, `preload`);
      L.setAttribute(`as`, `style`);
      L.addEventListener(`load`, (e: any) => {
        L.setAttribute(`rel`, `stylesheet`);
      });
    } else {
      L.setAttribute(`rel`, `stylesheet`);
    }
    L.setAttribute(`href`, href);
    this.document.head.appendChild(L);
  }

  private detectDevice(): void {
    this.ss.deviceInfo.device = this.dds.isDesktop()
      ? `desktop` : this.dds.isTablet()
        ? `tablet` : this.dds.isMobile()
          ? `mobile` : `unknow`;
    this.ss.deviceInfo.browser = this.dds.browser.toLowerCase();
    this.ss.deviceInfo.isXiaomiBrowser = /XiaoMi|MiuiBrowser/.test(this.dds.userAgent);
    this.ss.deviceInfo.browserVersion = parseInt(this.dds.browser_version.split(`.`)[0], 2);
    if (this.ss.isBrowser) {
      console.groupCollapsed(`%c DeviceInfo`, 'color:grey;font-size:12px;');
      console.log(this.ss.deviceInfo);
      console.groupEnd();
    }
  }

}
