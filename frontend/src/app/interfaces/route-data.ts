

import { Data } from '@angular/router';

export default interface IRouteData extends Data {
	lang: string;
	page: string;
	subpage?: string;
}
