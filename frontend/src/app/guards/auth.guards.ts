
import { isPlatformBrowser } from '@angular/common';
import { InjectionToken , Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { SharedService } from '@app/services/shared.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ILocalizationText from '../interfaces/localization-text';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isBrowser: boolean;
  private actionName: ILocalizationText = {
    ru: 'Ваша сессия завершена. Перезайдите в систему.',
    ua: 'Ваша сесія завершена. Перезайдіть в систему.',
    en: 'Your session has ended. Log back into the system.'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<any>,
              private router: Router,
              private authenticationService: AuthenticationService,
              public sharedService: SharedService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
    const accessToken = this.authenticationService.tokenValue;
    const tokenExp = this.checkAccessExpHelper(accessToken);
    if (accessToken && !tokenExp) {
      return true;
    } else {
      const refreshAlife = this.checkRefreshExpHelper();
      if (!refreshAlife && this.isBrowser) {
        return this.authenticationService.refreshToken()
          .pipe(map(status => {
            if (status) { return true; }
            this.redirectToLogin(route, state);
          }));
      }
      this.redirectToLogin(route, state);
    }
  }

  private checkAccessExpHelper(token: string): boolean {
    if (!token) { return true; }
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor(new Date().getTime() / 1000)) >= expiry;
  }

  private checkRefreshExpHelper(): boolean {
    if (this.isBrowser) {
      const timeNow = new Date().valueOf();
      const expiry = Number(localStorage.getItem('refreshTokenExpDate'));
      return ((expiry === null || !expiry) || timeNow >= expiry);
    }
  }

  private redirectToLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.sharedService.setGlobalEventData(this.actionName[this.sharedService.language], 'warning-window');
    const langRout = route.data.lang === 'en' ? '/' : route.data.lang;
    this.router.navigate([langRout + '/login/'], { queryParams: { returnUrl: state.url } });
    this.authenticationService.romeveLocalStore();
    return false;
  }
}
