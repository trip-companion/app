import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ACCOUNT_MORE_DATA_ACTION,
         LoadAccountUserDataAction,
         SetAccountUserAboutDataAction
} from '@app/store/actions/accountUserAboutData.action';
import { ApiService } from '@app/services/api.services';
import { catchError, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { LoadGlobalEventFailAction, LoadGlobalEventSuccessAction, LoadGlobalEventAction } from '../actions/globalEvent.action';
import { SharedService } from '@app/services/shared.service';
import { UserLoadAction } from '../actions/user.action';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';

@Injectable()
export class AccountUserDataEffects {

  @Effect() getAccountUserMoreData$ = this.actions$
    .pipe(ofType<LoadAccountUserDataAction>(ACCOUNT_MORE_DATA_ACTION.LOAD_MORE_USER_DATA),
      switchMap((actions) => {
        this.store.dispatch(new LoadGlobalEventAction());
        return forkJoin({
          features: this.api.getAllUserFeatures(),
          interests: this.api.getAllUserInterests(),
          languages: this.api.getAllUserLanguages(),
          skills: this.api.getAllUserSkills(),
          user: this.api.getCurrentUser(),
        });}),
      switchMap(data => [
        new SetAccountUserAboutDataAction({
          features: data.features,
          interests: data.interests,
          skills: data.skills,
          languages: data.languages
        }),
        new UserLoadAction(data.user),
        new LoadGlobalEventSuccessAction(),
      ]),
      catchError(error => of(new LoadGlobalEventFailAction(error)))
    );

  constructor(private actions$: Actions,
    private api: ApiService,
    private store: Store<AppState>,
    public sharedService: SharedService) {}
}
