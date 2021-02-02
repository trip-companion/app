
import { Injectable, Inject} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const MATHING_CONTETNT_LANG: {[key: string]: string} = {
	'en': `en-US`,
	'ru': `ru-RU`,
	'ua': `ua-UA`,
};

@Injectable()
export class SharedService {
	public languages: string[] = [`en`, `ru`, `ua`];
	public language = 'en';											// en|ru|ua
	private _contentLang: string;									// en-US | ru-RU | ua-UA |
	private isBrowser: boolean;
	public globalPrevRout: string;

	private phonePopUpDataSubject = new Subject<{tarif:string, name: string}>();
	$phonePopUpDataSubject = this. phonePopUpDataSubject.asObservable();

	constructor(@Inject(PLATFORM_ID) private platformId: Object,
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

	public updatePrevRout(rout: string) {
		this.globalPrevRout = rout;
	}

	public setDefaultLanguage(): void {
		console.log("here")
		if (this.isBrowser && !window.localStorage.getItem('lang')) {
			switch (window.navigator.language) {
				case 'ru':
				case 'ru-RU':
					window.localStorage.setItem('lang', 'ru');
					break;
				case 'ua':
				case 'ua-UA':
					window.localStorage.setItem('lang', 'ua');
					break;
				case 'en':
				case 'en-US':
					window.localStorage.setItem('lang', 'en');
					break;
				default:
					window.localStorage.setItem('lang', 'en');
			}
		}
	}
}
