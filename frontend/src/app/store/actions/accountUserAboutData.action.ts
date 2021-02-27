import { Action } from '@ngrx/store';

export enum ACCOUNT_MORE_DATA_ACTION {
    LOAD_DATA = 'LOAD_DATA',
    SET_DATA = 'SET_DATA',
}

export class LoadAccountUserDataAction implements Action {
    readonly type = ACCOUNT_MORE_DATA_ACTION.LOAD_DATA;
    // constructor(public pageId: string) {}
}

export class SetAccountUserAboutDataAction implements Action {
    readonly type = ACCOUNT_MORE_DATA_ACTION.SET_DATA;
    constructor(public payload: any) {}
}

export type AccountUserAboutDataActions = LoadAccountUserDataAction | SetAccountUserAboutDataAction;
