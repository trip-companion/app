import { Injectable } from '@angular/core';

@Injectable()
export class ResolverService {

  constructor() {}

  /**
   * Get SEGMENTS
   * @param {string} url RouterStateSnapshot.url
   * @returns {string[]} ["city?", "category", "sub_categoty"]
   * @memberof ResolverService
   */
  public getSegments(url: string): string[] {
    const PATH: string = /\?\w+=/.test(url) ? url.split(/\?\w+=/)[0] : url;
    return PATH.replace(/^\/|\/$/g, '').split(`/`);
  }

  /**
   * Get Categoty(after lang) url
   * @param {string[]} segments ["lang?", "category", "sub_categoty"]
   * @param {string} lang "ru" | "uk" | "en"
   * @returns {string} /?category/?sub_categoty/
   * @memberof ResolverService
   */
  public getCategoryUrl(segments: string[], lang: string): string {
    return this.normalizePATH(segments.slice(lang === `en` ? 0 : 1).join(`/`));
  }

// //////////////////////////////////////////////////////////// PRIVATE METHODS
  /**
   * @private
   * @param {string} url
   * @returns {string} with trailing slash
   * @memberof ResolverService
   */
  private normalizePATH(url: string): string {
    const U: string = url.replace(/\/{2,}/g, '/');
    return `/${U}/`.replace(/\/{2,}/g, '/');
  }
}
