import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';

// replace(/\/{2,}/g, '/')
// replace(/\/$/, '')
// /^\/|\/$/g   - или сначала или|и в конце
// /[^\/]\/$/  - не сначала или в конце

@Injectable()
export class LocationService {

  constructor(private router: Router,
              private sharedService: SharedService,
              private location: Location) {
  }

  public get PATH(): string {
    return /\?\w+=/.test(this.location.path()) ? this.location.path().split(/\?\w+=/)[0] : this.location.path();
  }

  public normalizePATH(url: string): string {
    const U: string = url.replace(/\/{2,}/g, '/');
    return `/${U}/`.replace(/\/{2,}/g, '/');
  }

  public joinWithLangRoutePath(url: string): string {
    return this.normalizePATH(`${this.getLangPATH()}${url}`);
  }
// ////////////////////////////////////////////////////////////////////////////

  /**
   * Lang PATH
   * @returns {string} `/` | `/ru/` | `/ua/`
   * @memberof LocationService
   */
  public getLangPATH(): string {
    return this.LANG === `en` ? `/` : `/${this.LANG}/`;
  }

  /**
   * After Lang PATH
   *  USED: [ DynamicLinksDirective ]
   * @returns {string}
   * @memberof LocationService
   */
  public getAfterLangPATH(): string {
    if (this.LANG === `en`) {
      return this.normalizePATH(this.SEGMENTS.slice(0, this.SEGMENTS.length).join('/'));
    } else {
      return this.normalizePATH(this.SEGMENTS.slice(1, this.SEGMENTS.length).join('/'));
    }
  }


  /**
   * GET after Lang PATH with trailing slash
   * USED: [ PageResolver ]
   * @param {string} url
   * @returns {string}
   * @memberof LocationService
   */
  public getAfterLangPathFromUrl(url: string): string {
    const SEGMENTS: string[] = url.replace(/^\/|\/$/g, ``).split(`/`);
    return this.normalizePATH(SEGMENTS.slice(this.LANG === `en` ? 0 : 1, SEGMENTS.length).join('/'));
  }

  public getLocalizationPathWith(lang: string): string {
    return this.normalizePATH(`${lang === `en` ? `/` : lang}/${this.getAfterLangPATH()}`);
  }

  /**
   *  USED: [ goHome() && Redirect301Component() ]
   * @returns {string} `/` | `/ru/` | `/ua/`
   * @memberof LocationService
   */
  public extractBasePATH(): string {
    return this.normalizePATH(`${this.getLangPATH()}`);
  }

  /**
   * Extracts parent URL
   * @param step number
   *  1: first parent
   *  2: second parent
   * return: parent URL in format: /parent-routename
   */
  public extractParentURL(step: number = 1): string {
    const url: string = this.router.routerState.snapshot.url;
    return `${url.split('/').slice(0, url.split('/').length - step).join('/')}`;
  }

  /**
   * Get Alternative Lang Url
   * FROM: [ header, sidenav ]
   * @param {string} alternateRoute from LocalizationService
   * @returns {string}
   * @memberof LocationService
   */
  public getAlternativeLangUrl(alternateRoute: string): string {
    return this.normalizePATH(`${alternateRoute}${this.getAfterLangPATH()}`);
  }

// //////////////////////////////////////////////////////////////////////// PRIVATE METHODS
  private get SEGMENTS(): string[] {
    return this.PATH.replace(/^\/|\/$/g, '').split(`/`);
  }

  private get LANG(): string {
    return this.sharedService.language;
  }
}
