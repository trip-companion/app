import {  Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private tokenSubject: BehaviorSubject<string>;
    public token: Observable<string>;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private http: HttpClient
    ) {
        this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('accessToken'));
        this.token = this.tokenSubject.asObservable();
    }

    public get tokenValue(): string {
        return this.tokenSubject.value;
    }

    public login(name: string, password: string) {
        try {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { name, password })
            .pipe(map(res => {
                localStorage.setItem('accessToken', res.accessToken);
                this.tokenSubject.next(res.accessToken);
            }));
        } catch (e) {
            console.log(e)
        }

    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('accessToken');
        this.tokenSubject.next(null);
        this.router.navigate(['/login']);
        window.location.reload();
        // this.routerwindow.location.href = 'HomeScreen.html'
    }
}