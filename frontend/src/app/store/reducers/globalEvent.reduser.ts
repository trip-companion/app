import * as GlobalEventActions from '../actions/globalEvent.action';

export interface State {
  loadingPageContent: boolean;
  successMessage: string;
  error: Error;
}

const initialState: State = {
  loadingPageContent: false,
  successMessage: null,
  error: undefined,
};

export const globalEventReducer = (state = initialState, action: GlobalEventActions.GlobalEventActions): State => {

  switch (action.type) {
    case GlobalEventActions.GLOBAL_EVENT_ACTION.EVENT_ACTION:
      return {
        ...state,
        successMessage: null,
        loadingPageContent: true
      };

    case GlobalEventActions.GLOBAL_EVENT_ACTION.EVENT_SUCCESS:
      return action.payload
        ? {
          ...state,
          successMessage: action.payload,
          loadingPageContent: false,
        }
        : {
          ...state,
          successMessage:  null,
          loadingPageContent: false,
        };


    case GlobalEventActions.GLOBAL_EVENT_ACTION.EVENT_FAIL:
      return {
        ...state,
        loadingPageContent: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
