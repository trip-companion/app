import * as GlobalEventActions from '../actions/globalEvent.action';

export interface State {
	loadingPageContent: boolean,
	error: Error,
};

const initialState: State = {
	loadingPageContent: false,
	error: undefined,
};

export function globalEventReducer(state = initialState, action: GlobalEventActions.GlobalEventActions): State {
	switch (action.type) {
		case GlobalEventActions.GLOBAL_EVENT_ACTION.EVENT_ACTION:
			return {
				...state,
				loadingPageContent: true
			}

		case GlobalEventActions.GLOBAL_EVENT_ACTION.EVENT_SUCCESS:
			return {
				...state,
				loadingPageContent: false,
			}

		case GlobalEventActions.GLOBAL_EVENT_ACTION.EVENT_FAIL:
			return {
				...state,
				loadingPageContent: false, 
				error: action.payload,
			}

		default:
			return {...state};
	};
};