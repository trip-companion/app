
import { Injectable, Inject} from '@angular/core';
// Models
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
	public isFirstVisit = true;
	public languages: string[] = [`en`, `ru`, `ua`];
	public language = 'en';											// en|ru|ua
	private _contentLang: string;									// en-US | ru-RU | ua-UA |
	private isBrowser: boolean;
	public currenArticleInBlog:number;
	public currentCardInPrice: { id:number, category: string };

	public searchBlogValue: string = '';
	public notMainBlogPage:boolean;
	public searchInBlogPageOn:boolean = false;
	public currentPaginationPageInBlog: number =  0;
	public redirectBlogUrl:string;

	private searchInBlogPageOnSubject = new Subject<boolean>();
	$searchInBlogPageOn = this.searchInBlogPageOnSubject.asObservable();

	private currentPaginationPageInBlogSubject = new Subject<number>();
	$currentPaginationPageInBlog = this.currentPaginationPageInBlogSubject.asObservable();

	private phonePopUpDataSubject = new Subject<{tarif:string, name: string}>();
	$phonePopUpDataSubject = this. phonePopUpDataSubject.asObservable();

	constructor(@Inject(PLATFORM_ID) private platformId: Object,
				@Inject(DOCUMENT) private document: Document,
				public router: Router) {
		this.isBrowser = isPlatformBrowser(platformId);
	};

	public get contentLang(): string {
		return MATHING_CONTETNT_LANG[this.language];
	};

	public defineLang(lang: string): void {
		this.language = lang;
		if (this.isBrowser) {
			window.localStorage.setItem('lang', this.language);
		}
	};

	public setDefaultLanguage(): void {
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
			};
		};
	};
	
	public choiceArticleInPageBlog(id:number) {
		this.currenArticleInBlog = id;
	};

	public choiceCardInPricePage(id: number, category: string) {
		this.currentCardInPrice = {id, category};
	};

	public changePaginationPageInBlog(pageNum: number )  {
		this.currentPaginationPageInBlogSubject.next(pageNum);
		this.currentPaginationPageInBlog = pageNum;
	};

	public updatePrevRout(routName:string) {
		if(routName.indexOf('/blog') === -1) {
			this.searchInBlogPageOn = false;
		};
	};

	public clearBlogSearch() {
		this.searchInBlogPageOn = false;
		this.searchInBlogPageOnSubject.next(false);
		this.changePaginationPageInBlog(1);
		this.currentPaginationPageInBlog = 1;
	};

	public takeBlogRedirectUrl() {
		switch (this.language) {
			case 'ru':
				this.redirectBlogUrl = "/ru/blog/";
				break;
			case 'en':
				this.redirectBlogUrl = "/en/blog/";
				break;
			default:
				this.redirectBlogUrl =  "/blog/";
				break;
		};
	};

	public onBlogSearch(event: any, notMainPage: boolean) {
		const charCode = (event.which) ? event.which : event.keyCode;
		const that = event.target;
		this.takeBlogRedirectUrl();

		const changeSearchStatus = (status:boolean) =>{
			
			this.searchBlogValue = that.value;
			this.searchInBlogPageOn = status;
			this.changePaginationPageInBlog(1);
			this.currentPaginationPageInBlog = 1;

			return this.searchInBlogPageOnSubject.next(status);
		};

		if(charCode === 13 && that.value.length > 0) {
			changeSearchStatus(that.value.length > 0);
			this.router.navigate([this.redirectBlogUrl])
		} else if(charCode === 13 && that.value.length  === 0) {
			changeSearchStatus(that.value.length > 0);
			this.router.navigate([this.redirectBlogUrl])
		};
	};



	public helpPaginationResolverForBlogPage(url: string) {
		let numberPage:number;
		const urlLeng = url.length;

		if(urlLeng === 13) {
			numberPage = Number(url.slice(11, -1));

			if(numberPage <= 1) {
				return '/blog/';
			} else {
				this.changePaginationPageInBlog(numberPage);
				this.currentPaginationPageInBlog = numberPage;
				return null;
			};
		} else {
			return '/blog/';
		};
	};

	//phone popup start
	public setContentToPhonePopUp(tarif: string, name: string)  {
		this.phonePopUpDataSubject.next({tarif, name});
	};
	//phone popup end

};
