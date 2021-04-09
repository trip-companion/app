import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Services
import { ResolverService } from '@app/services/resolver.service';
import { LocationService } from '@app/services/location.service';
import { SsrRedirectService } from '@app/services/SsrRedirect.service';
import { SeoService } from '@app/services/seo.service';
import { StateService } from '@app/services/state.service';
// Interfaces
import { IRouteConfig, IRouterChildConfig } from '@app/interfaces/route-config';
// RxJS
import { Observable, of } from 'rxjs';

import { ROUTER_CONFIG } from '@app/DATA/router.config';

@Injectable()
export class PageResolver implements Resolve<string|null> {
  public CATEGORY_MODE: string;
  private ROUTERS: string[] = [];
  private ROUTERS_CATEGORY: string[] = [];

  constructor(private router: Router,
              private locationService: LocationService,
              private ssrRedirectService: SsrRedirectService,
              private resolverService: ResolverService,
              private stateService: StateService,
              public seoService: SeoService,) {
    this.pushRoute(ROUTER_CONFIG);
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string|null> {
    const URL_SEGMENTS: string[] = this.resolverService.getSegments(state.url);
    const CATEGORY_URL: string = this.resolverService.getCategoryUrl(URL_SEGMENTS, route.data.lang);
    const PAGE_NAME = `${route.data.page}${!!route.data.subpage ? `${route.data.subpage}` : ``}`;
    const X = this.isRedirectRoute(CATEGORY_URL, true);
    const REDIRECT_URL: string | null = !!X ? this.locationService.joinWithLangRoutePath(X) : null;

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
    }

    if (REDIRECT_URL) {
      this.redirect301(REDIRECT_URL);
      return of(null);
    }

    this.stateService.routerData = route.data;

    this.seoService.updateMeta(PAGE_NAME, CATEGORY_URL);
    return of(CATEGORY_URL);
  }

  private isRedirectRoute(url: string, isMain: boolean): null | string {

    this.CATEGORY_MODE = this.resolverService.getCategoryMode(url);
    if (!!this.ROUTERS.find((r: string) => r === url)) {
      return isMain ? null : this.ROUTERS.find((r: string) => r === url);
    }

    const X: string[] = url.replace(/^\/|\/$/g, ``).split(`/`);
    const X2: string = this.locationService.normalizePATH(X.slice(0, X.length - 1).join(`/`));

    switch (this.CATEGORY_MODE) {
      case 'CATEGORY':
        const categoryLink: string = this.ROUTERS_CATEGORY.find((link: string) => url === link);
        if(isMain) {
          return categoryLink ? null : this.isRedirectRoute(X2, false);
        } else {
          return categoryLink ? categoryLink : this.isRedirectRoute(X2, false);
        }
      case 'SUB_CATEGORY':
        console.log('in sub category: ', X, X2, isMain);
        //if pagination: account/trip-list/page-[1-99]
        if(/trip-list+\/page-[1-9][0-9]?\//.test(url) && X.length === 3) {
          //func for calculate article in pagination
          return isMain?null:url;
        }
        //if dont found go the is redirect with - /***/ and true status
        break;
      default:
        break;
    };

    return this.isRedirectRoute(X2, false);
  }

  private redirect301(url: string): void {
    this.ssrRedirectService.redirectWithStatus(301, 'Moved Permanently', url);
    this.router.navigate([url]);
  }

  private pushRoute(config: IRouteConfig[]): void {
    config.forEach((c: IRouteConfig) => {
      if(!!c.coreUrl) {
        this.ROUTERS.push(this.locationService.normalizePATH(c.url));
        c.childConfig.forEach((childConfig: IRouterChildConfig) =>
          this.ROUTERS_CATEGORY.push(this.locationService.normalizePATH(childConfig.url)));
      } else {
        this.ROUTERS.push(this.locationService.normalizePATH(c.url));
      };
    });
  }
}
