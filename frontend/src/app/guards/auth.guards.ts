  
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { SharedService } from '@app/services/shared.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	private isBrowser: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object,
		private router: Router,
		private authenticationService: AuthenticationService,
		public sharedService: SharedService,
	) {
		this.isBrowser = isPlatformBrowser(platformId);
	}

	private checkAccessExpHelper(token: string) {
		if(!token) return true;
		const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
		return (Math.floor((new Date).getTime() / 1000)) >= expiry;
	}

	private checkRefreshExpHelper() {
		if (this.isBrowser) {
			const timeNow =  new Date().valueOf();
			const expiry = Number(localStorage.getItem('refreshTokenExpDate'));
			return ((expiry === null || !expiry) || timeNow >= expiry);
		}
	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
		const accessToken = this.authenticationService.tokenValue;
		const tokenExp = this.checkAccessExpHelper(accessToken);
		if (accessToken  && !tokenExp)  {
			return true;
		} else {
			const refreshAlife = this.checkRefreshExpHelper();
			if(!refreshAlife && this.isBrowser) {
				return this.authenticationService.refreshToken()
					.pipe(map(status => {
						if(status) return true;
						this.redirectToLogin(route, state)
				}))
			}
			this.redirectToLogin(route, state)
		}
	}

	private redirectToLogin( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const langRout = route.data.lang === 'en'? '/' : route.data.lang;
		this.router.navigate([langRout + '/login/'], { queryParams: { returnUrl: state.url } });
		this.authenticationService.romeveLocalStore();
		return false;
	}
}