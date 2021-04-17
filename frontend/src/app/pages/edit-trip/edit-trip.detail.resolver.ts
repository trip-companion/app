import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


import { Observable, of } from 'rxjs';
import { map,catchError, first } from 'rxjs/operators';
import { AppState , getEditTripById } from '@app/store/app.state';
import { Store } from '@ngrx/store';

import { IUserTrip } from '@app/interfaces/store/userTripList';
import { LoadGlobalEventSuccessAction, LoadGlobalEventAction } from '@app/store/actions/globalEvent.action';

@Injectable()
export class EditTripDetailResolver implements Resolve<IUserTrip | boolean> {
    private isBrowser = true;

    constructor(@Inject(PLATFORM_ID) private platformId: any,
      private store: Store<AppState>,
      private router: Router,) {
      this.isBrowser = isPlatformBrowser(platformId);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUserTrip | boolean> {
      const lang = route.data.lang;
      this.store.dispatch(new LoadGlobalEventAction());

      return this.store.select(getEditTripById, {id: route.params.id}).pipe(
        map((trip: IUserTrip) => {
          if (trip) {
            this.store.dispatch(new LoadGlobalEventSuccessAction());
            return trip;
          } else {
            //here metod http for search this  trip
            // this.router.navigate([lang === `en` ? `/` : `/${lang}/`]);
            return of(false);
          }
        }),
        first((trip: IUserTrip) => trip?true:false),
        catchError((error: Error) => this.errorHandler(error, true, lang))
      );
    }

    private errorHandler(error: Error, isNeedRedirect: boolean, lang: string): Observable<boolean> {
      if (this.isBrowser) {
        console.groupCollapsed(`DataPage.resolve() %cCatchError:  '/${isNeedRedirect ? '<<<' : '>>>'}`, 'color:#FE9336;font-size:13px;');
        console.log(error);
        console.groupEnd();
      } else {
        console.log(`DataPage.resolve() CatchError:  /${isNeedRedirect ? '<<<' : '>>>'}`);
      }

      if (isNeedRedirect) {
        this.router.navigate([lang === `en` ? `/` : `/${lang}/`]);
        return of(true);
      } else {
        return of(false);
      }
    }
}
