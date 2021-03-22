import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { USER_ACTION, GetUserAction, UserLoadAction, UpdateUserAction } from '@app/store/actions/user.action';
import { ApiService } from '@app/services/api.services';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadGlobalEventFailAction, LoadGlobalEventSuccessAction } from '../actions/globalEvent.action';
import { SharedService } from '@app/services/shared.service';
import { GLOBAL_SUCCESS_MESSAGE } from '@app/DATA/success-message';

@Injectable()
export class UserEffects {

  @Effect() getUser$ = this.actions$
    .pipe(ofType<GetUserAction>(USER_ACTION.LOAD_USER_ACTION),
      switchMap(() => this.api.getCurrentUser()
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
        switchMap(actions => this.api.putUserCurrent({...actions.user})
          .pipe(switchMap(user => {
            this.sharedService.setGlobalEventData(GLOBAL_SUCCESS_MESSAGE.find(obj =>
              'account/' === obj.url)[this.sharedService.language][1], 'success-window');
            return [
              new LoadGlobalEventSuccessAction(),
              new UserLoadAction(user),
            ];
          }),
          catchError(error => of(new LoadGlobalEventFailAction(error)))
          )
        )
      );

    constructor(private actions$: Actions,
      private api: ApiService,
      public sharedService: SharedService,) {}
}
