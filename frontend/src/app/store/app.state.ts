import { ActionReducerMap } from '@ngrx/store';

import * as User from './reducers/user.reduser';
import * as GlobalEvent from './reducers/globalEvent.reduser';

export interface AppState {
    userInfo: User.State,
    globalEvent: GlobalEvent.State
};

export const reducers: ActionReducerMap<AppState> = {
    userInfo: User.userReducer,
    globalEvent: GlobalEvent.globalEventReducer
};