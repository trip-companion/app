import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Services
import { ResolverService } from '@app/services/resolver.service';
import { LocationService } from '@app/services/location.service';
import { SsrRedirectService } from '@app/services/SsrRedirect.service';
// import { SeoService } from '@app/services/seo.service';
import { StateService } from '@app/services/state.service';
// Interfaces
import IRouteConfig from '@app/interfaces/route-config';
// RxJS
import { Observable, of } from 'rxjs';

import { ROUTER_CONFIG } from '@app/DATA/router.config';


@Injectable()
export class PageResolver implements Resolve<string|null> {
	private ROUTERS: string[] = [];

	constructor(private router: Router,
				private locationService: LocationService,
				private ssrRedirectService: SsrRedirectService,
				private resolverService: ResolverService,
				private stateService: StateService,) {
		this.pushRoute(ROUTER_CONFIG);
	}

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string|null> {

		const URL_SEGMENTS: string[] = this.resolverService.getSegments(state.url);
		const CATEGORY_URL: string = this.resolverService.getCategoryUrl(URL_SEGMENTS, route.data.lang);
		const PAGE_NAME = `${route.data.page}${!!route.data.subpage ? `${route.data.subpage}` : ``}`;
		const X = this.isRedirectRoute(CATEGORY_URL, true);
		const REDIRECT_URL: string|null = !!X ? this.locationService.joinWithLangRoutePath(X) : null

		if (this.stateService.isBrowser) {
			console.groupCollapsed(`%c PageResolver ${REDIRECT_URL ? `: redirect 301` : ``}`, 'color:#00E2FF;font-size:12px;');
			console.log(`URL_SEGMENTS:	${URL_SEGMENTS}`);
			console.log(`CATEGORY_URL:	${CATEGORY_URL}`);
			console.log(`PAGE_NAME:		${PAGE_NAME}`);
			console.log(`REDIRECT_URL:	${REDIRECT_URL}`);
			console.log(route.data);
			console.log(route);
			console.log(state);
			console.groupEnd();
		} else {
			console.log(`PageResolver: ${!REDIRECT_URL ? CATEGORY_URL : `redirect 301: ${REDIRECT_URL}`}`);
		};
		
		if (REDIRECT_URL) {
			this.redirect301(REDIRECT_URL);
			return of(null);
		};

		this.stateService.routerData = route.data;
		//тут нужно будет и инитить данные из бэка по этой странице
		
		// когда появится сео
		// this.seoService.updateMeta(PAGE_NAME, CATEGORY_URL);	
		return of(CATEGORY_URL);
	}

	private isRedirectRoute(url: string, isMain: boolean): null|string {

		if (!!this.ROUTERS.find((r: string) => r === url)) {
			return isMain ? null : this.ROUTERS.find((r: string) => r === url);
		};

		const X: string[] = url.replace(/^\/|\/$/g, ``).split(`/`);
		const X2: string = this.locationService.normalizePATH(X.slice(0, X.length - 1).join(`/`));
		return this.isRedirectRoute(X2, false);
	};

	private redirect301(url: string): void {
		this.ssrRedirectService.redirectWithStatus(301, 'Moved Permanently', url);
		this.router.navigate([url]);
	};

	private pushRoute(config: IRouteConfig[]): void {
		config.forEach((c: IRouteConfig) => {
			!!c.coreUrl ? this.pushRoute(c.childConfig) : this.ROUTERS.push(this.locationService.normalizePATH(c.url));
		});
	};
}
