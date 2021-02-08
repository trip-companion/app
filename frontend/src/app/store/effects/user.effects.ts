import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects"
import { USER_ACTION, LoadUserAction, LoadUserSuccessAction, LoadUserFailAction, GetUser, UpdateUser } from "@app/store/actions/user.action";
import { ApiService } from "@app/services/api.services";
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from "rxjs";

// import IUserModel  from '@app/interfaces/store.models/user.model';

@Injectable()
export class UserEffects {
    
	@Effect() getUser$ = this.actions$
		.pipe(ofType<LoadUserAction>(USER_ACTION.LOAD_USER_ACTION),
			mergeMap(() => this.api.getCurrentUser()
				.pipe(
					map((user) => {
						new LoadUserSuccessAction();
						return new GetUser(user);
					}),
					catchError( error => of(new LoadUserFailAction(error)))
				)
			)
		);

	constructor(private actions$: Actions,
		private api: ApiService,) {}
};