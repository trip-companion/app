import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { LANGUAGE_MODEL } from '@app/models/language.model';
import { SharedService } from '@app/services/shared.service';

@Injectable()
export class SetHeaderInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (isApiUrl) {
      request = request.clone({
        setHeaders: {
          Language: LANGUAGE_MODEL[this.sharedService.language]
        }
      });
    }

    return next.handle(request);
  }
}
