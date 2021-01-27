import { Directive, AfterViewChecked, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
	selector: '[CorrectLinkHref]'
})
export class CorrectLinkHrefDirective implements AfterViewChecked {
	public isBrowser: boolean;

	constructor(@Inject(ElementRef) private element: ElementRef,
				@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(platformId);
	}

	public ngAfterViewChecked(): void {
		this.correct();
	}

	/**
     * @description в Браузере href абсолютный - pathname относительный
     *              на ноде href относительный - pathname пуст
     */
	private correct(): void {
		const LINK: HTMLAnchorElement = this.element.nativeElement;
		const PATH: string = this.isBrowser ? LINK.pathname : LINK.href;
		
		LINK.href = `/${PATH}/`.replace(/\/{2,}/g, '/');
	}
}
