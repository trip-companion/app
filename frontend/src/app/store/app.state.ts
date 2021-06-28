import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as User from './reducers/user.reduser';
import * as GlobalEvent from './reducers/globalEvent.reduser';
import * as PageData from './reducers/pageData.reduser';
import * as AcountUserData from './reducers/accountUserAboutData.reduser';
import * as AccountTripList from './reducers/accountTripList.reduser';

export interface AppState {
  userInfo: User.State;
  globalEvent: GlobalEvent.State;
  pageData: PageData.State;
  accountAboutData: AcountUserData.State;
  userTrips: AccountTripList.State;
}

export const reducers: ActionReducerMap<AppState, any> = {
  userInfo: User.userReducer,
  globalEvent: GlobalEvent.globalEventReducer,
  pageData: PageData.pageDataReducer,
  accountAboutData: AcountUserData.accountUserAboutReducer,
  userTrips: AccountTripList.accountUserAboutReducer,
};

export const getPageDataState = createFeatureSelector<PageData.State>('pageData');
export const getAccountAboutDataState = createFeatureSelector<AcountUserData.State>('accountAboutData');
export const getUserData = createFeatureSelector<User.State>('userInfo');
export const getAccountripList = createFeatureSelector<AccountTripList.State>('userTrips');
// page state data
export const getPageData = createSelector(getPageDataState, PageData.getPageDataContent);

export const getAccountAboutData = createSelector(getAccountAboutDataState, AcountUserData.getAccountUserAboutData);

export const getUserAvatar = createSelector(getUserData, User.userAvatar);
export const getUserId = createSelector(getUserData, User.userId);

export const getTripList = createSelector(getAccountripList, AccountTripList.tripList);
export const getEditTripById = createSelector(
  getAccountripList,
  (state, props) => AccountTripList.tripById(state, props)
);
