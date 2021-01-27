
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
// Services
import { SsrRedirectService } from '../../services/SsrRedirect.service';
import { LocationService } from '../../services/location.service';

@Component({
	selector: 'app-redirect-301',
	styles: [``],
	template: ``
})
export class Redirect301Component {

	constructor(@Inject(PLATFORM_ID) private platformId: Object,
				private router: Router,
				private ssrRedirectService: SsrRedirectService,
				private locationService: LocationService) {
		const REDIRECT_URL: string = this.locationService.extractBasePATH();
		if (isPlatformBrowser(platformId)) {
			console.groupCollapsed(`Redirect301Component %c301 Moved Permanently:  >>> ${REDIRECT_URL || `/`}`, 'color:#00E2FF;font-size:12px;');
			// console.log(this.router);
			console.groupEnd();
		} else {
			console.log(`Redirect301Component 301 Moved Permanently:  >>> ${REDIRECT_URL || `/`}`);
		}
		this.ssrRedirectService.redirectWithStatus(301, 'Moved Permanently', REDIRECT_URL);
		this.router.navigate([REDIRECT_URL]);
	}
}
