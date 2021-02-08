import { ActionReducerMap } from '@ngrx/store';

import * as User from './reducers/user.reduser'

export interface AppState {
    userInfo: User.State,
};

export const reducers: ActionReducerMap<AppState> = {
    userInfo: User.userReducer,
};