import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
// Interfaces
// import { ISeoData } from '../interfaces/seo-data';
// Services
import { StateService } from './state.service';
import { SharedService } from './shared.service';

// import { SEO_DATA } from '../DATA/seo-data';

// <html lang="...">
// <title>....</title>
// <meta name="description" itemprop="description" content="...">
// <meta itemprop="image" content="...">
// <meta httpequiv="Content-Language" content="...">
// <meta name="robots" content="...">
// <link hreflang="..." rel="alternate" href="...">
// <link rel="canonical" href="..."/>
// <meta property="og:title" content="...">
// <meta property="og:url" content="...">
// <meta property="og:image" content="...">
// <meta property="og:site_name" content="...">
// <meta property="og:description" content="...">
// <meta property="twitter:card" content="...">
// <meta property="twitter:title" content="...">
// <meta property="twitter:description" content="...">
// <meta property="twitter:image" content="...">

@Injectable()
export class SeoService {
	private hrefOrigin: string;
	private image: string;
	private imageHead: string;

	constructor(@Inject(DOCUMENT) private document,
				//@Optional() @Inject('TARGET_ORIGIN') protected targetOrigin: string,       // added to providers in server.ts
				private meta: Meta,
				private titleService: Title,
				private stateService: StateService,
				private sharedService: SharedService) {
	  this.hrefOrigin = this.stateService.isBrowser ? this.document.location.origin : `https://prod.domen`;
	  this.image = `${this.hrefOrigin}/assets/images/main_logo.jpg`;
	  this.imageHead = `${this.hrefOrigin}/assets/images/main_logo.jpg`;
	}

	// ////////////////////////////////////////////////////////// CHECK URL METHODS

	public updateMeta(page: string, currentUrl: string): void {
	  // const SD: ISeoData = SEO_DATA.find((sd: ISeoData) => sd.page === page );
	  // console.log(SD);
	  // if (!SD) { return; }
	  const LANG: string = this.sharedService.language;
	  const LOCATION: string = this.concateLocation(this.hrefOrigin, LANG, currentUrl); // this.document.location.href;
	  const CANONICAL_URL: string = LOCATION;

	  // console.log(LOCATION, CANONICAL_URL,currentUrl, page)

	  if (this.stateService.isBrowser) {
	    console.groupCollapsed(`%c SeoService.update()`, 'color:purupre;font-size:12px;');
	    // console.log(SD);
	    console.groupEnd();
	  }
	  this.removeTags();

	  // <html lang="...">
	  this.document.documentElement.lang = this.sharedService.contentLang;

	  // <title>
	  // this.titleService.setTitle(SD.title[LANG]);

	  // <meta name="description" itemprop="description" content="...">
	  //  this.meta.addTag({name: 'description',  itemprop: 'description', content: SD.description[LANG]});

	  // <meta itemprop="image" content="...">
	  this.meta.addTag({itemprop: 'image', content: this.image});

	  // <meta httpequiv="Content-Language" content="...">
	  this.meta.addTag({httpEquiv: 'Content-Language', content: this.sharedService.contentLang});

	  // <meta name="robots" content="...">
	  this.meta.addTag({name: 'robots', content: `noindex,follow`});

	  // <link hreflang="..." rel="alternate" href="...">
	  this.sharedService.languages.forEach((lang: string) => {
	    const L = this.document.createElement('link');
	    L.setAttribute('rel', 'alternate');
	    L.setAttribute('hreflang', lang);
	    L.setAttribute('href', this.concateLocation(this.hrefOrigin, lang, currentUrl));
	    this.document.head.appendChild(L);
	  });

	  // <link rel="canonical" href="..."/>

	  const linkCanonicalElement = this.document.createElement('link');
	  linkCanonicalElement.setAttribute('rel', 'canonical');
	  linkCanonicalElement.setAttribute('href', CANONICAL_URL);
	  this.document.head.appendChild(linkCanonicalElement);

	  // <meta property="og:..." content="...">
	  // this.meta.addTag({property: 'og:title',  content: SD.title[LANG]});
	  this.meta.addTag({property: 'og:url', content: LOCATION});
	  this.meta.addTag({property: 'og:image', content: this.imageHead});
	  this.meta.addTag({property: 'og:site_name', content: 'Trip companion'});
	  // this.meta.addTag({property: 'og:description',  content: SD.description[LANG]});

	  // <meta property="twitter:..." content="...">
	  // this.meta.addTag({property: 'twitter:card',  content: `summary`});
	  // this.meta.addTag({property: 'twitter:title',  content: SD.title[LANG]});
	  // this.meta.addTag({property: 'twitter:description',  content: SD.description[LANG]});
	  // this.meta.addTag({property: 'twitter:image',  content: this.image});
	}

	private concateLocation(origin: string, lang: string, url: string): string {
	  return `${origin}${lang === `en` ? `` : `/${lang}`}${url}`;
	}

	private removeTags(): void {
	  this.meta.removeTag('name="title"');
	  this.meta.removeTag('name="description"');
	  this.meta.removeTag('name="robots"');
	  this.meta.removeTag('itemprop="image"');
	  this.meta.removeTag('httpEquiv="Content-Language"');

	  this.meta.removeTag('property="og:title"');
	  this.meta.removeTag('property="og:url"');
	  this.meta.removeTag('property="og:image"');
	  this.meta.removeTag('property="og:site_name"');
	  this.meta.removeTag('property="og:description"');
	  // this.meta.removeTag('property="og:type"');
	  // this.meta.removeTag('property="article:published_time"');
	  // this.meta.removeTag('property="article:modified_time"');

	  this.meta.removeTag('property="twitter:card"');
	  this.meta.removeTag('property="twitter:title"');
	  this.meta.removeTag('property="twitter:description"');
	  this.meta.removeTag('property="twitter:image"');

	  const hlEn: Element = this.document.head.querySelector(`link[hreflang="en"]`);
	  if(hlEn) {this.document.head.removeChild(hlEn);}
	  const hlUk: Element = this.document.head.querySelector(`link[hreflang="ua"]`);
	  if(hlUk) {this.document.head.removeChild(hlUk);}
	  const hlRu: Element = this.document.head.querySelector(`link[hreflang="ru"]`);
	  if(hlRu) {this.document.head.removeChild(hlRu);}

	  const canonicalElem: Element = this.document.head.querySelector(`link[rel="canonical"]`);
	  if(canonicalElem) {this.document.head.removeChild(canonicalElem);}
	};
};
