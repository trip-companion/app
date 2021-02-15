import {  Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../environments/environment';
import { LocationService } from '@app/services/location.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnInit {
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
	) {
		this.isBrowser = isPlatformBrowser(platformId);
		this.tokenSubject = new BehaviorSubject<string | null>(null);
		this.token = this.tokenSubject.asObservable();
	}

	public get tokenValue(): string {
		return this.tokenSubject.value;
	}

	public set setTokenValue(token) {
		this.tokenSubject.next(token);
	}

	public ngOnInit(): void {

	}

	public login(email: string, password: string) {
		
		return this.http.post<any>(`${this.apiUrl}public/auth`, { email, password })
			.pipe(map(res => {
				this.setLocalStorage(res.jwtAccessToken, res.jwtRefreshToken, res.jwtRefreshTokenExpireDate);
				if (this.isBrowser) {
					this.tokenSubject.next(res.jwtAccessToken);
				}
			})
		);
	}

	public singUp(email: string, firstName: string, lastName: string, password: string) {
		return this.http.post<any>(`${this.apiUrl}public/user`, { email, firstName, lastName, password });
	}

	public refreshToken(): Observable<boolean> {
		const refreshToken = localStorage.getItem("refreshToken");

		return this.http.post<any>(`${this.apiUrl}public/auth/refresh`, { jwtRefreshToken: refreshToken })
			.pipe(map(res => {
				this.setLocalStorage(res.jwtAccessToken, res.jwtRefreshToken, res.jwtRefreshTokenExpireDate);
				if (this.isBrowser) this.tokenSubject.next(res.jwtAccessToken);
				return true;
			}),catchError((error: HttpErrorResponse | HttpResponse<any>): Observable<boolean> => {
				return of(false)
			})
		)
	}

	private setLocalStorage(access: string, refresh: string, dateExp:  string ) {
		if (this.isBrowser) {
			localStorage.setItem('accessToken', access);
			localStorage.setItem('refreshToken', refresh);
			localStorage.setItem('refreshTokenExpDate', dateExp);
		}
	}

	public romeveLocalStore() {
		if (this.isBrowser) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('refreshTokenExpDate');
			this.tokenSubject.next(null);
		}
	}

	public logout() {
		const localLang = localStorage.getItem('lang');
		const langRout = localLang === 'en'? '/' : localLang;
		this.romeveLocalStore();
		this.router.navigate([langRout + '/']);
	}
}