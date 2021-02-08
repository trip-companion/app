import * as UserActions from '../actions/user.action';
import  IUserModel  from '@app/interfaces/store.models/user.model';

export interface State {
	user: IUserModel | null,
	loading: boolean,
	error: Error,
};

const initialState: State = {
	user: null,
	loading: false,
	error: undefined,
};

export function userReducer(state = initialState, action: UserActions.UserActions ) {
	switch (action.type) {
		case UserActions.USER_ACTION.LOAD_USER_ACTION:
			return {
				...state,
				loading: true
			}

		case UserActions.USER_ACTION.LOAD_USER_SUCCESS:
			return {
				...state, 
				user: action.payload,
				loading: false,
			}

		default:
			return state;
	};
};