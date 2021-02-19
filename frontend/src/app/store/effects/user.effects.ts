import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { USER_ACTION, GetUserAction, UserLoadAction, UpdateUserAction } from '@app/store/actions/user.action';
import { ApiService } from '@app/services/api.services';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadGlobalEventFailAction, LoadGlobalEventSuccessAction } from '../actions/globalEvent.action';

@Injectable()
export class UserEffects {

  @Effect() getUser$ = this.actions$
    .pipe(ofType<GetUserAction>(USER_ACTION.LOAD_USER_ACTION),
      switchMap((actions) => this.api.getCurrentUser()
        .pipe(switchMap(user => [
          new LoadGlobalEventSuccessAction(),
          new UserLoadAction(user)
        ]),
        catchError(error => of(new LoadGlobalEventFailAction(error)))
        )
      )
    );

    @Effect() updateUser$ = this.actions$
      .pipe(ofType<UpdateUserAction>(USER_ACTION.UPDATE_USER_ACTION),
        switchMap((actions) => this.api.putUserCurrent({...actions.user})
          .pipe(switchMap(user => [
            new LoadGlobalEventSuccessAction(),
            new UserLoadAction(user)
          ]),
          catchError(error => of(new LoadGlobalEventFailAction(error)))
          )
        )
      );

    constructor(private actions$: Actions,
    private api: ApiService,) {}
}
