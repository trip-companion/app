
import { Injectable } from '@angular/core';
import { Data, Params } from '@angular/router';
// Models
import { BehaviorSubject } from 'rxjs';

export interface IDeviceInfo {
    device: string;					// desktop | tablet | mobile | unknow
    browser: string;				// chrome | opera | safari | firefox | ms-edge | ie
    isXiaomiBrowser: boolean;
	browserVersion: number;
}

@Injectable()
export class StateService {
	public isBrowser: boolean;
	public appId: string;
	// Device Info
	public deviceInfo: IDeviceInfo = <IDeviceInfo>{};
	public scrollableElement: Element|HTMLElement = null;

	public currentYear: number;
	private _routerData: Data = null;
	
    private updateRouterDataMessage = new BehaviorSubject<Data>(null);
    public updateRouterData$ = this.updateRouterDataMessage.asObservable();
	public queryParams: Params = {};
	public _initialUrl: string = null;  

	// public isToggleSidebar:BehaviorSubject<boolean> = new BehaviorSubject(false);
	// public toggleSidebarObservable = this.isToggleSidebar.asObservable()
	// public isToggleClassForHeader:BehaviorSubject<boolean> = new BehaviorSubject(false);
	// public toggleClassForHeaderObservable = this.isToggleClassForHeader.asObservable()

	constructor() {
		this.currentYear = new Date().getFullYear();
	};

	public set routerData(data: Data) {
		console.log("new data", data)
		this._routerData = data;
		this.updateRouterDataMessage.next(this._routerData);
	};
	public get routerData(): Data {
		return this._routerData
	};

	public get isFixHideChromeAddressbar(): boolean {
        return this.deviceInfo.browser === `chrome` && this.deviceInfo.device !== `desktop` && this.deviceInfo.browserVersion > 41;
	};

	public isDesktop(): boolean {
		return this.deviceInfo.device === `desktop`;
	};

	public isTablet(): boolean {
		return this.deviceInfo.device === `tablet`;
	};

	public isMobile(): boolean {
		return this.deviceInfo.device === `mobile`;
	};

};
