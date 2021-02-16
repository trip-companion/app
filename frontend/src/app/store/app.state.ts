import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as User from './reducers/user.reduser';
import * as GlobalEvent from './reducers/globalEvent.reduser';
import * as PageData from './reducers/pageData.reduser';

export interface AppState {
    userInfo: User.State;
    globalEvent: GlobalEvent.State;
    pageData: PageData.State;
}

export const reducers: ActionReducerMap<AppState, any> = {
    userInfo: User.userReducer,
    globalEvent: GlobalEvent.globalEventReducer,
    pageData: PageData.pageDataReducer,
};

export const getPageDataState = createFeatureSelector<PageData.State>('pageData');
// page state data
export const getPageData = createSelector(getPageDataState, PageData.getPageDataContent);
