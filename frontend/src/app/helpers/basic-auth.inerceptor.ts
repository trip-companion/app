import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/services/authentication.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add header with basic auth credentials if user is logged in and request is to the api url
        const token = this.authenticationService.tokenValue;
        const isLoggedIn = token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        const isRefreshTokenReq = request.url.includes("/api/public/auth/refresh");

        if (isLoggedIn && isApiUrl && !isRefreshTokenReq) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}