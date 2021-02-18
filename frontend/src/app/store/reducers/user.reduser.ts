import * as UserActions from '../actions/user.action';
import IUserModel from '@app/interfaces/store.models/user.model';

export interface State {
  user: IUserModel;
  loading: boolean;
}

const initialState: State = {
  user: null,
  loading: false,
};

export const userReducer = (state = initialState, action: UserActions.UserActions): State => {

  switch (action.type) {
    case UserActions.USER_ACTION.LOAD_USER_ACTION:
      return {
        ...state,
        user: null,
        loading: true
      };

    case UserActions.USER_ACTION.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    default:
      return {...state};
  }
};
