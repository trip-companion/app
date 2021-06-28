import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// Services
// Interfaces
// Models
// RXJS
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class TripListResolver implements Resolve<number> {
    private isBrowser: boolean = true;

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private router: Router,) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {

        const PAGE_NUM: number = route.routeConfig.path.includes(`page-`) ? parseInt(route.routeConfig.path.split(`page-`)[1], 0) : 1;
        let IS_NEED_LOAD_FOR_PAGE: boolean = false;

        return of(1);
    }
}
