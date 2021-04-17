import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ApiService } from '@app/services/api.services';
import { catchError, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { LoadGlobalEventFailAction, LoadGlobalEventSuccessAction, LoadGlobalEventAction } from '../actions/globalEvent.action';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { USER_TRIP_ACTION, AddUserTripAction, SetUserTripAction } from '../actions/accountTripList.action';

import { UserTripModel } from '@app/models/trip-user.model';

@Injectable()
export class AccountTripListEffects {

	@Effect() addUserTrip$ = this.actions$
	  .pipe(ofType<AddUserTripAction>(USER_TRIP_ACTION.ADD_USER_TRIP),
	    switchMap((action) => {
	      this.store.dispatch(new LoadGlobalEventAction());
	      //here http req
	      return of(new UserTripModel(action.payload))
	        .pipe(switchMap(userTrip => [
	          new LoadGlobalEventSuccessAction(),
	          new SetUserTripAction(userTrip)
	        ]
	        ),
	        catchError(error => {
	          new LoadGlobalEventFailAction(error);
	          return throwError(error);
	        })
	        );
	    })
	  );

	constructor(private actions$: Actions,
    private api: ApiService,
    private store: Store<AppState>,) {}
}
