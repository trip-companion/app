
import { Injectable, Inject} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '@environments/environment';

const MATHING_CONTETNT_LANG: {[key: string]: string} = {
  en: `en-US`,
  ru: `ru-RU`,
  ua: `ua-UA`,
};

@Injectable()
export class SharedService {
  public languages: string[] = [`en`, `ru`, `ua`];
  public language = 'en';											// en|ru|ua
  public globalPrevRout: string;
  public globalEventSubject = new Subject<{message: string; type: string}>();
  public $globalEventSubject = this.globalEventSubject.asObservable();
  private isBrowser: boolean;
  private host: string = environment.host;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    public router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public get contentLang(): string {
    return MATHING_CONTETNT_LANG[this.language];
  }

  public defineLang(lang: string): void {
    this.language = lang;
    if (this.isBrowser) {
      window.localStorage.setItem('lang', this.language);
    }
  }

  public updatePrevRout(rout: string): void {
    this.globalPrevRout = rout;
  }

  public setGlobalEventData(message: string, type: string): void {
    this.globalEventSubject.next({message, type});
  }

  public getCorrectImg(apiSrc: string): string {
    return this.host + apiSrc;
  }
}
