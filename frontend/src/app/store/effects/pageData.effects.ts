import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PAGE_DATA_ACTION, SetPageDataAction, LoadPageDataAction } from '@app/store/actions/pageData.action';
import { ApiService } from '@app/services/api.services';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoadGlobalEventFailAction } from '../actions/globalEvent.action';
import { SharedService } from '@app/services/shared.service';
import { LANGUAGE_MODEL } from '@app/models/language.model';

@Injectable()
export class PageDataEffects {

  @Effect() getPageData$ = this.actions$
    .pipe(ofType<LoadPageDataAction>(PAGE_DATA_ACTION.LOAD_PAGE_DATA),
      switchMap((actions) => this.api.getCurrentPageData(actions.pageId, LANGUAGE_MODEL[this.sharedService.language])),
      switchMap(data => [
        new SetPageDataAction(data),
      ]),
      catchError(error => {
        new LoadGlobalEventFailAction(error);
        return throwError(error);
      }),
    );

  constructor(private actions$: Actions,
              private api: ApiService,
              public sharedService: SharedService) {}
}
