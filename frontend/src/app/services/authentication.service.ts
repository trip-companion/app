import {  Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable  } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../environments/environment';
import { LocationService } from '@app/services/location.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';

import { HandleErrorService } from './handleError.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private isBrowser: boolean;
	private tokenSubject: BehaviorSubject<string>;
	public token: Observable<string>;
	private apiUrl: string = environment.apiUrl;
	public homePath =  this.locationService.extractBasePATH();

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private router: Router,
		private http: HttpClient,
		public locationService: LocationService,
		private HES: HandleErrorService,
	) {
		this.isBrowser = isPlatformBrowser(platformId);
		this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('accessToken'));
		this.token = this.tokenSubject.asObservable();
	}

	public get tokenValue(): string {
		return this.tokenSubject.value;
	}

	public login(email: string, password: string) {
		try {
			return this.http.post<any>(`${this.apiUrl}public/auth`, { email, password })
				.pipe(map(res => {
					this.setLocalStorage(res.jwtAccessToken, res.jwtRefreshToken, res.jwtRefreshTokenExpireDate);
					this.tokenSubject.next(res.jwtAccessToken);
					return  true;
				}));
		} catch (e) {
			console.log(e)
		}
	}

	public singUp(email: string, firstName: string, lastName: string, password: string) {
		return this.http.post<any>(`${this.apiUrl}public/user`, { email, firstName, lastName, password })
	}

	public refreshToken(): Observable<boolean> {
		const refreshToken = localStorage.getItem("refreshToken");
		
		return this.http.post<any>(`${this.apiUrl}public/auth/refresh`, { jwtRefreshToken: refreshToken })
		.pipe(map(res => {
			console.log(res)
			this.setLocalStorage(res.jwtAccessToken, res.jwtRefreshToken, res.jwtRefreshTokenExpireDate);
			this.tokenSubject.next(res.jwtAccessToken);
			return true;
		}),
			catchError((error: HttpErrorResponse | HttpResponse<any>) => {
				return <never> this.HES.handleError(error, this.isBrowser)
			})
		)
	}

	private setLocalStorage(access: string, refresh: string, dateExp:  string ) {
		localStorage.setItem('accessToken', access);
		localStorage.setItem('refreshToken', refresh);
		localStorage.setItem('refreshTokenExpDate', dateExp);
	}

	public romeveLocalStore() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('refreshTokenExpDate');
		this.tokenSubject.next(null);
	}

	public logout() {
		this.romeveLocalStore();
		this.router.navigate([this.homePath]);
	}
}