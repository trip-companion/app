import { Action } from '@ngrx/store';

export enum ACCOUNT_MORE_DATA_ACTION {
    LOAD_MORE_USER_DATA = 'LOAD_MORE_USER_DATA',
    SET_MORE_USER_DATA = 'SET_MORE_USER_DATA',
}

export class LoadAccountUserDataAction implements Action {
    readonly type = ACCOUNT_MORE_DATA_ACTION.LOAD_MORE_USER_DATA;
}

export class SetAccountUserAboutDataAction implements Action {
    readonly type = ACCOUNT_MORE_DATA_ACTION.SET_MORE_USER_DATA;
    constructor(public payload: any) {}
}

export type AccountUserAboutDataActions = LoadAccountUserDataAction | SetAccountUserAboutDataAction;
