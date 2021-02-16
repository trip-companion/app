
import { Injectable, Inject} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const MATHING_CONTETNT_LANG: {[key: string]: string} = {
  en: `en-US`,
  ru: `ru-RU`,
  ua: `ua-UA`,
};

@Injectable()
export class SharedService {
  public languages: string[] = [`en`, `ru`, `ua`];
  public language = 'en';											// en|ru|ua
  private isBrowser: boolean;
  public globalPrevRout: string;

  private globalEventSubject = new Subject<{message: string, type: string}>();
  $globalEventSubject = this.globalEventSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object,
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
}
