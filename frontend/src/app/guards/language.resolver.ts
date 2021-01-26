import {Observable, of} from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
// Servicesxs
import { SharedService } from '../services/shared.service';
import { StateService } from '../services/state.service';

@Injectable()
export class LanguageResolver implements Resolve<boolean>  {
	constructor(private stateService: StateService,
				private sharedService: SharedService) {}

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		
		if (this.stateService.isBrowser) {
			console.groupCollapsed(`%c LangResolver`, 'color:blue;font-size:12px;');
			console.log(`APP LANG:	    ${route.data.lang}`);
			console.groupEnd();
		} else {
			console.log(`LangResolver: ${route.data.lang}`);
		}

		this.sharedService.defineLang(route.data.lang);
		return of(true);
	}
}
