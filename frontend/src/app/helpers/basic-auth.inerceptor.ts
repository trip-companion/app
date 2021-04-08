import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/services/authentication.service';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  public token: string;
  public isApiUrl: boolean;
  public isPublicUri: boolean;
  public apiUrl: string = environment.apiUrl;
  constructor(private authSrv: AuthenticationService,) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isApiUrl = request.url.startsWith(environment.apiUrl);
    this.isPublicUri = request.url.includes('/api/public/');
    this.token = this.authSrv.tokenValue;

    if(!this.isPublicUri && this.authSrv.checkAccessExpHelper(this.token) && this.token) {
      return this.authSrv.refreshToken().pipe(
        switchMap((status: boolean) => {
          if(status) {
            this.token = this.authSrv.tokenValue;
            return next.handle(this.addToken(request));
          } else {
            this.authSrv.logout();
            return EMPTY;
          }
        })
      );
    };

    if (this.token && this.isApiUrl && !this.isPublicUri) {
      request = this.addToken(request);
    };

    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    });
  };
}
