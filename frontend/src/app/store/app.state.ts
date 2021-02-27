import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as User from './reducers/user.reduser';
import * as GlobalEvent from './reducers/globalEvent.reduser';
import * as PageData from './reducers/pageData.reduser';
import * as AcountUserData from './reducers/accountUserAboutData.reduser';

export interface AppState {
  userInfo: User.State;
  globalEvent: GlobalEvent.State;
  pageData: PageData.State;
  accountAboutData: AcountUserData.State;
}

export const reducers: ActionReducerMap<AppState, any> = {
  userInfo: User.userReducer,
  globalEvent: GlobalEvent.globalEventReducer,
  pageData: PageData.pageDataReducer,
  accountAboutData: AcountUserData.accountUserAboutReducer,
};

export const getPageDataState = createFeatureSelector<PageData.State>('pageData');
export const getAccountAboutDataState = createFeatureSelector<AcountUserData.State>('accountAboutData');
// page state data
export const getPageData = createSelector(getPageDataState, PageData.getPageDataContent);
export const getAccountAboutData = createSelector(getAccountAboutDataState, AcountUserData.getAccountUserAboutData);
