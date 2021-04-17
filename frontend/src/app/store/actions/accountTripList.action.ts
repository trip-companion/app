import { Action } from '@ngrx/store';
import { IUserTrip } from '@app/interfaces/store/userTripList';

export enum USER_TRIP_ACTION {
    GET_USER_TRIP_LIST = 'GET_USER_TRIP_LIST',
    SET_USER_TRIP_LIST = 'SET_USER_TRIP_LIST',
    GET_USER_TRIP = 'GET_USER_TRIP',
    ////////////////////////////////////////////
    CHANGE_STATUS_USER_TRIP = 'CHANGE_STATUS_USER_TRIP',
    CHANGE_DATE_USER_TRIP = 'CHANGE_DATE_USER_TRIP',
    EDIT_USER_TRIP = 'EDIT_USER_TRIP',
    ADD_USER_TRIP = 'ADD_USER_TRIP',
    SET_USER_TRIP = 'SET_USER_TRIP',
    UPDATE_USER_TRIP = 'UPDATE_USER_TRIP',
}

export class GetUserTripListAction implements Action {
    readonly type = USER_TRIP_ACTION.GET_USER_TRIP_LIST;
    constructor(public payload: string) {}
}

export class SetUserTripListAction implements Action {
    readonly type = USER_TRIP_ACTION.SET_USER_TRIP_LIST;
    constructor(public payload: IUserTrip[]) {}
}

export class EditUserTripAction implements Action {
    readonly type = USER_TRIP_ACTION.EDIT_USER_TRIP;
    constructor(public payload: IUserTrip) {}
}

export class ChangeStatusTripAction implements Action {
    readonly type = USER_TRIP_ACTION.CHANGE_STATUS_USER_TRIP;
    constructor(public payload: {status: boolean; id: string}) {}
}

export class ChangeDateTripAction implements Action {
    readonly type = USER_TRIP_ACTION. CHANGE_DATE_USER_TRIP;
    constructor(public payload: {statusDate: string; id: string}) {}
}

export class UpdateUserTripAction implements Action {
    readonly type = USER_TRIP_ACTION.UPDATE_USER_TRIP;
    constructor(public payload: IUserTrip) {}
}

export class AddUserTripAction implements Action {
    readonly type = USER_TRIP_ACTION.ADD_USER_TRIP;
    constructor(public payload: IUserTrip) {}
}

export class SetUserTripAction implements Action {
    readonly type = USER_TRIP_ACTION.SET_USER_TRIP;
    constructor(public payload: IUserTrip) {}
}

export type UserTripsActions = EditUserTripAction | GetUserTripListAction | SetUserTripListAction
    | AddUserTripAction | SetUserTripAction | UpdateUserTripAction | ChangeDateTripAction | ChangeStatusTripAction;
