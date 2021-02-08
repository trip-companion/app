import { Action } from '@ngrx/store';
import  IUserModel  from '@app/interfaces/store.models/user.model';

export enum USER_ACTION {
    GET_USER = "GET_USER",
    UPDATE_USER= "UPDATE_USER",
    LOAD_USER_ACTION = "LOAD_USER_ACTION",
    LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS",
    LOAD_USER_FAIL = "LOAD_USER_FAIL",
}
//use effect ngrx
export class LoadUserAction implements Action {
    readonly type = USER_ACTION.LOAD_USER_ACTION;
};

export class LoadUserSuccessAction implements Action {
    readonly type = USER_ACTION.LOAD_USER_SUCCESS;
};

export class LoadUserFailAction implements Action {
    readonly type = USER_ACTION.LOAD_USER_FAIL;
    constructor(public payload: Error) {}
};
// use effect ngrx
export class GetUser implements Action {
    readonly type = USER_ACTION.GET_USER;
    constructor(public payload: IUserModel) {}
};

export class UpdateUser implements Action {
    readonly type = USER_ACTION.UPDATE_USER
    constructor(public payload: IUserModel) {}
};

export type UserActions = LoadUserAction | LoadUserSuccessAction | LoadUserFailAction | GetUser | UpdateUser;