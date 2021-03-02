
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
  public deviceInfo: IDeviceInfo = {} as IDeviceInfo;
  public scrollableElement: Element|HTMLElement = null;
  public queryParams: Params = {};
  public currentYear: number;

  public updateRouterDataMessage = new BehaviorSubject<Data>(null);
  public updateRouterData$ = this.updateRouterDataMessage.asObservable();

  public isToggleSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public toggleSidebar$ = this.isToggleSidebar.asObservable();
  private routerDataVaribale: Data = null;
  // public isToggleClassForHeader:BehaviorSubject<boolean> = new BehaviorSubject(false);
  // public toggleClassForHeaderObservable = this.isToggleClassForHeader.asObservable()

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  public set routerData(data: Data) {
    this.routerDataVaribale = data;
    this.updateRouterDataMessage.next(this.routerDataVaribale);
  }

  public get routerData(): Data {
    return this.routerDataVaribale;
  }

  public get isFixHideChromeAddressbar(): boolean {
    return this.deviceInfo.browser === `chrome` && this.deviceInfo.device !== `desktop` && this.deviceInfo.browserVersion > 41;
  }

  public isDesktop(): boolean {
    return this.deviceInfo.device === `desktop`;
  }

  public isTablet(): boolean {
    return this.deviceInfo.device === `tablet`;
  }

  public isMobile(): boolean {
    return this.deviceInfo.device === `mobile`;
  }

}
