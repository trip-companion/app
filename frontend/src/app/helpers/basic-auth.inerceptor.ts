import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/services/authentication.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authSrv.tokenValue;
    const isLoggedIn = token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isPublicUri = request.url.includes('/api/public/');
    //for check token before send req
    if(request.method !== 'GET' && !isPublicUri) {
      if(!this.authSrv.checkAccessExpHelper(token)) {
        this.authSrv.refreshToken();
      }
    };
    if (isLoggedIn && isApiUrl && !isPublicUri) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    };

    return next.handle(request);
  }
}
