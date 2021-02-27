import * as Actions from '../actions/accountUserAboutData.action';
import { IAcountUserData } from '@app/interfaces/store.models/accountUserData.model';

export interface State {
  data: IAcountUserData;
  loading: boolean;
}

const initialState: State = {
  data: null,
  loading: false,
};

export const accountUserAboutReducer = (state = initialState, action: Actions.AccountUserAboutDataActions): State => {

  switch (action.type) {
    case Actions.ACCOUNT_MORE_DATA_ACTION.LOAD_DATA:
      return {
        ...state,
        data: null,
        loading: true
      };

    case Actions.ACCOUNT_MORE_DATA_ACTION.SET_DATA:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    default:
      return {...state};
  }
};

export const getAccountUserAboutData = (state: State) => state.data;
