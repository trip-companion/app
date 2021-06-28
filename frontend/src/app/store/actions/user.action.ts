import { Action } from '@ngrx/store';
import IUserModel from '@app/interfaces/store/user';

export enum USER_ACTION {
    UPDATE_USER_ACTION = 'UPDATE_USER_ACTION',
    LOAD_USER_ACTION = 'LOAD_USER_ACTION',
    LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS',
    UPDATE_USER_LOCAL_ACTION = 'UPDATE_USER_LOCAL_ACTION',
}

export class GetUserAction implements Action {
    readonly type = USER_ACTION.LOAD_USER_ACTION;
}

export class UserLoadAction implements Action {
    readonly type = USER_ACTION.LOAD_USER_SUCCESS;
    constructor(public payload: IUserModel) {}
}

export class UpdateUserAction implements Action {
    readonly type = USER_ACTION.UPDATE_USER_ACTION;
    constructor(public user: IUserModel) {}
};

export class UpdateUserLocalAction implements Action {
    readonly type = USER_ACTION.UPDATE_USER_LOCAL_ACTION;
    constructor(public payload: IUserModel) {}
}

export type UserActions = GetUserAction | UserLoadAction | UpdateUserAction | UpdateUserLocalAction;
