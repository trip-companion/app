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
//services
import { SharedService } from './services/shared.service';
import { LocationService } from './services/location.service';
import { ResolverService } from './services/resolver.service';
import { SsrRedirectService } from './services/SsrRedirect.service';
import { StateService } from './services/state.service';
//global  module
import { GlobalPreloaderModule } from './components/global-preloader/global-preloader.module';
import { GlobalEventModule } from './components/global-event/global-event.module';
import { HeaderModule } from './components/app-header/app-header.module';
//guards
import { LanguageResolver } from './guards/language.resolver';
import { PageResolver } from './guards/page.resolver';
import { HandleErrorService } from './services/handleError.service';
//component
import { Redirect301Component } from './components/redirect301/redirect301.component';
import { reducers } from '@app/store/app.state';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationService } from './services/authentication.service';
//Interceptor
import { BasicAuthInterceptor } from '@app/helpers/basic-auth.inerceptor';
import { ErrorInterceptor }  from '@app/helpers/error.interceptor';

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
	// UI Modules
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
	HandleErrorService,
	{ provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 

  private lazyStyles: string[] = [
		// `lazy-style.css`,
	];

	constructor(@Inject(DOCUMENT) private document: Document,
				@Inject(PLATFORM_ID) private platformId: Object,
				@Inject(APP_ID) private appId: string,
				public SS: StateService,
				private DDS: DeviceDetectorService,
				private authService: AuthenticationService,) {
		const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
		console.log(`Running ${platform} with appId=${appId}`);

		this.SS.isBrowser = isPlatformBrowser(platformId);
		this.SS.appId = appId;

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
			L.addEventListener(`load`, (e: Event) => {
				e.target[`setAttribute`](`rel`, `stylesheet`);
			});
		} else {
			L.setAttribute(`rel`, `stylesheet`);
		}
		L.setAttribute(`href`, href);
		this.document.head.appendChild(L);
	}

	private detectDevice(): void {
        this.SS.deviceInfo.device = this.DDS.isDesktop() ? `desktop` : this.DDS.isTablet() ? `tablet` : this.DDS.isMobile() ? `mobile` : `unknow`;
        this.SS.deviceInfo.browser = this.DDS.browser.toLowerCase();
        this.SS.deviceInfo.isXiaomiBrowser = /XiaoMi|MiuiBrowser/.test(this.DDS.userAgent);
        this.SS.deviceInfo.browserVersion = parseInt(this.DDS.browser_version.split(`.`)[0]);
		
		if (this.SS.isBrowser) {
			console.groupCollapsed(`%c DeviceInfo`, 'color:grey;font-size:12px;');
			console.log(this.SS.deviceInfo);
			console.groupEnd();
		}
  };

}
