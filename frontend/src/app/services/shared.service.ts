
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '@environments/environment';
import { ValidationErrors } from '@angular/forms';

const MATHING_CONTETNT_LANG: {[key: string]: string} = {
  en: `en-US`,
  ru: `ru-RU`,
  ua: `ua-UA`,
};

@Injectable()
export class SharedService {
  public languages: string[] = ['en', 'ru', 'ua'];
  public language = 'en'; // en|ru|ua
  public globalPrevRout: string;
  public globalEventSubject = new Subject<{message: string; type: string}>();
  public $globalEventSubject = this.globalEventSubject.asObservable();
  private isBrowser: boolean;
  private host: string = environment.host;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
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

  public getPasswordErrorMessage(err: ValidationErrors | null, arrOfErr: string[]): string {
    if(err.pattern) {
      switch (err.pattern.requiredPattern) {
        case `${/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/}`:
          return arrOfErr[2];
        case '/[a-z]/':
          return arrOfErr[3];
        case '/[A-Z]/':
          return arrOfErr[4];
        case '/\d/':
          return arrOfErr[5];
        case '/^(\S*\s){0,0}\S*$/':
          return arrOfErr[5];
        case '/^[^а-яёіїєґ]+$/i':
          return arrOfErr[8];
        default:
          return arrOfErr[7];
      }
    } else {
      return arrOfErr[7];
    }
  }
}
