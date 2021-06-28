import IPageDataModel from '@app/interfaces/store/pageData';
import * as Actions from '../actions/pageData.action';

export interface State {
  page: IPageDataModel;
  loading: boolean;
}

const initialState: State = {
  page: null,
  loading: false,
};

export const pageDataReducer = (state = initialState, action: Actions.PageDataActions): State => {

  switch (action.type) {
    case Actions.PAGE_DATA_ACTION.LOAD_PAGE_DATA:
      return {
        ...state,
        page: null,
        loading: true
      };

    case Actions.PAGE_DATA_ACTION.SET_PAGE_DATA:
      return {
        ...state,
        page: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export const getPageDataContent = (state: State) => state.page;
