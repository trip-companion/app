  
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { LocationService } from '@app/services/location.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	public homePath =  this.locationService.extractBasePATH();
	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		public locationService: LocationService,
	) { }

	private checkAccessExpHelper(token: string) {
		if(!token) return true;
		const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
		return (Math.floor((new Date).getTime() / 1000)) >= expiry;
	}

	private checkRefreshExpHelper() {
		const timeNow =  new Date().valueOf();
		const expiry = Number(localStorage.getItem('refreshTokenExpDate'));
		return ((expiry === null || !expiry) || timeNow >= expiry);
	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
		const accessToken = this.authenticationService.tokenValue;
		const tokenExp = this.checkAccessExpHelper(accessToken);
		if (accessToken  && !tokenExp)  {
			return true;
		} else {
			const refreshAlife = this.checkRefreshExpHelper();
			if(!refreshAlife) {
				return this.authenticationService.refreshToken()
					.pipe(map(status => {
						if(status) return true;
						this.redirectToLogin(state)
				}))
			}
			this.redirectToLogin(state)
		}
	}

	private redirectToLogin( state: RouterStateSnapshot) {
		this.authenticationService.romeveLocalStore();
		this.router.navigate([this.homePath + '/login/'], { queryParams: { returnUrl: state.url } });
		return false;
	}
}