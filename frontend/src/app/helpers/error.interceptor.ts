import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/services/authentication.service';
import { SharedService } from '@app/services/shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private isBrowser: boolean;
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
        private authenticationService: AuthenticationService,
        public sharedService: SharedService,) {
            this.isBrowser = isPlatformBrowser(platformId);
        }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401 && !request.url.includes('/api/public/auth')) {
                this.authenticationService.logout();
            }

            if (this.isBrowser) {
                console.groupCollapsed(`%cHandleError`, 'color:red;font-size:13px;');
                console.log(err);
                console.groupEnd();
            } else {
                console.log(`HandleErrorService.handleError(error.status: ${err.status})`);
                console.log(err);
            }

            const errorText = err.error.message || err.statusText;
            this.sharedService.setGlobalEventData(errorText, 'error-window');
            return throwError(err);
        }))
    }
}