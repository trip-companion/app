import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SharedService } from '@app/services/shared.service';
import { LoadPageDataAction } from '@app/store/actions/pageData.action';
import { LoadGlobalEventAction, LoadGlobalEventSuccessAction } from '@app/store/actions/globalEvent.action';
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { catchError, first, tap, } from 'rxjs/operators';

@Injectable()
export class PageDataResolver implements Resolve<any> {
  private isBrowser = true;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private router: Router,
              private store: Store<AppState>,
              public sharedService: SharedService,) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const lang = route.data.lang;
    const pageName = `${route.data.page}${!!route.data.subpage ? `${route.data.subpage}` : ``}`;

    this.store.dispatch(new LoadGlobalEventAction());
    this.store.dispatch(new LoadPageDataAction(pageName));
    return this.store.pipe(
      select('pageData'),
      tap((pageData) => {
        if (!pageData.loading) {
          this.store.dispatch(new LoadGlobalEventSuccessAction());
        }
      }),
      // filter(pageData => pageData.page),
      first((pageData) => {
        if (pageData.page != null) { return true; }
      }),
      catchError((error: Error) => this.errorHandler(error, true, lang))
    );
  }

  private errorHandler(error: Error, isNeedRedirect: boolean, lang: string): Observable<any> {
    if (this.isBrowser) {
      console.groupCollapsed(`DataPage.resolve() %cCatchError:  '/${isNeedRedirect ? '<<<' : '>>>'}`, 'color:#FE9336;font-size:13px;');
      console.log(error);
      console.groupEnd();
    } else {
      console.log(`DataPage.resolve() CatchError:  /${isNeedRedirect ? '<<<' : '>>>'}`);
    }

    if (isNeedRedirect) {
      this.router.navigate([lang === `en` ? `/` : `/${lang}/login/`]);
      return of(true);
    } else {
      return of(false);
    }
  }
}


