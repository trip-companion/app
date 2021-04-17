import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '@environments/environment';
import { LocationService } from '@app/services/location.service';
import { catchError, map } from 'rxjs/operators';
import IUserModel from '@app/interfaces/store/user';
import { UserLoadAction } from '@app/store/actions/user.action';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { UserModel } from '@app/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public token: Observable<string>;
  public apiUrl: string = environment.apiUrl;
  private isBrowser: boolean;
  private tokenSubject: BehaviorSubject<string>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private http: HttpClient,
    private store: Store<AppState>,
    public locationService: LocationService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.tokenSubject = new BehaviorSubject<string | null>(null);
    this.token = this.tokenSubject.asObservable();
  }

  public get tokenValue(): string {
    return this.tokenSubject.value;
  }

  public set setTokenValue(token: string) {
    if(this.validatorISO8859_1(token)) {
      this.tokenSubject.next(token);
    } else {
      this.logout();
    }
  }

  public login(email: string, password: string): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}public/auth`, { email, password })
      .pipe(map(res => {
        this.setLocalStorage(res.jwtAccessToken, res.jwtRefreshToken, res.jwtRefreshTokenExpireDate);
        this.checkIsUserLoggedIn();
        return res;
      }));
  }

  public singUp(email: string, firstName: string, lastName: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}public/users`, { email, firstName, lastName, password });
  }

  public romeveLocalStore(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshTokenExpDate');
    }
    this.tokenSubject.next(null);
  }

  public logout(): void {
    const localLang = this.isBrowser?localStorage.getItem('lang'):'';
    const langRout = localLang === 'en' ? '/' : localLang;
    this.romeveLocalStore();
    this.router.navigate([langRout + '/']);
  }

  public refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}public/auth/refresh`, { jwtRefreshToken: refreshToken })
      .pipe(map(res => {
        this.setLocalStorage(res.jwtAccessToken, res.jwtRefreshToken, res.jwtRefreshTokenExpireDate);
        return true;
      }), catchError((error: HttpErrorResponse | HttpResponse<any>): Observable<boolean> => of(false))
      );
  }

  public checkAccessExpHelper(token: string): boolean {
    if (!token) { return true; }
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor(new Date().getTime() / 1000)) >= expiry;
  }

  public checkRefreshExpHelper(): boolean {
    if (this.isBrowser) {
      const timeNow = new Date().valueOf();
      const expiry = Number(localStorage.getItem('refreshTokenExpDate'));
      return ((expiry === null || !expiry) || timeNow >= expiry);
    }
  }

  public checkValidTokenWhenInitApp(): void {
    const accessToken = this.tokenValue;
    const tokenExp = this.checkAccessExpHelper(accessToken);

    if (accessToken && !tokenExp) {
      this.checkIsUserLoggedIn();
    } else if(this.isBrowser) {
      if (!this.checkRefreshExpHelper()) {
        this.refreshToken().subscribe(status => {
          if(status) {
            this.checkIsUserLoggedIn();
          } else {
            this.romeveLocalStore();
          }
        });
      }
    };
  }

  public checkIsUserLoggedIn(): void {
    this.http.get<IUserModel>(`${this.apiUrl}users/current`, {})
      .subscribe(response => {
        if(response) {this.store.dispatch(new UserLoadAction(new UserModel(response)));}
      });
  }

  private setLocalStorage(access: string, refresh: string, dateExp: string): void {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('refreshTokenExpDate', dateExp);
    }
    this.tokenSubject.next(access);
  }

  private validatorISO8859_1(token: string): boolean {
    return !/[^\u0000-\u00ff]/g.test(token);
  }
}
