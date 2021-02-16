import { Action } from '@ngrx/store';

export enum PAGE_DATA_ACTION {
    LOAD_PAGE_DATA = 'LOAD_PAGE_DATA',
    SET_PAGE_DATA = 'SET_PAGE_DATA',
}

export class LoadPageDataAction implements Action {
    readonly type = PAGE_DATA_ACTION.LOAD_PAGE_DATA;
    constructor(public pageId: string) {}
}

export class SetPageDataAction implements Action {
    readonly type = PAGE_DATA_ACTION.SET_PAGE_DATA;
    constructor(public payload: any) {}
}

export type PageDataActions = LoadPageDataAction | SetPageDataAction;
