
import { isPlatformBrowser } from '@angular/common';
import { InjectionToken , Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { SharedService } from '@app/services/shared.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import IGlobalEventMessage from '@app/interfaces/global-message-validator';
import { GLOBAL_WARNING_MESSAGE } from '@app/DATA/warning-message';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  public warningMessage: IGlobalEventMessage;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<any>,
              private router: Router,
              private authSrv: AuthenticationService,
              public sharedService: SharedService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.warningMessage = GLOBAL_WARNING_MESSAGE.find(obj => 'auth-guard' === obj.url)[this.sharedService.language];
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
    const accessToken = this.authSrv.tokenValue;
    const tokenExp = this.authSrv.checkAccessExpHelper(accessToken);

    if (accessToken && !tokenExp) {
      return true;
    } else if(this.isBrowser) {
      if (!this.authSrv.checkRefreshExpHelper()) {
        return this.authSrv.refreshToken()
          .pipe(map(status => {
            if (status) { return true; }
            this.redirectToLogin(route, state);
          }));
      }
      this.redirectToLogin(route, state);
    } else {
      //for ssr in node
      return true;
    }
  }

  private redirectToLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.sharedService.setGlobalEventData(this.warningMessage[0], 'warning-window');
    const langRout = route.data.lang === 'en' ? '/' : route.data.lang;
    this.router.navigate([langRout + '/login/'], { queryParams: { returnUrl: state.url } });
    this.authSrv.romeveLocalStore();
    return false;
  }
}
