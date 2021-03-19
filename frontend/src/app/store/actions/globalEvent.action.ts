import { Action } from '@ngrx/store';

export enum GLOBAL_EVENT_ACTION {
    EVENT_SUCCESS = 'EVENT_SUCCESS',
    EVENT_FAIL = 'EVENT_FAIL',
    EVENT_ACTION = 'EVENT_ACTION',
}

export class LoadGlobalEventAction implements Action {
    readonly type = GLOBAL_EVENT_ACTION.EVENT_ACTION;
}

export class LoadGlobalEventSuccessAction implements Action {
    readonly type = GLOBAL_EVENT_ACTION.EVENT_SUCCESS;
    constructor(public payload?: string) {}
}

export class LoadGlobalEventFailAction implements Action {
    readonly type = GLOBAL_EVENT_ACTION.EVENT_FAIL;
    constructor(public payload: Error) {}
}

export type GlobalEventActions = LoadGlobalEventFailAction | LoadGlobalEventSuccessAction | LoadGlobalEventAction;
