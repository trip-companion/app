import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { PathLocationStrategy } from '@angular/common';

const _orig_prepareExternalUrl = PathLocationStrategy.prototype.prepareExternalUrl;

PathLocationStrategy.prototype.prepareExternalUrl = function(internal) {
	const url = _orig_prepareExternalUrl.call(this, internal);

	if (url === '' || url.endsWith('.html') || url.endsWith('/')) {
		return url;
	} else { 
		return url + '/';
	}
};

const disableConsole = (): void => {
	if (window) {
		window.console.log = (): void => {};
		window.console.dir = (): void => {};
		window.console.groupCollapsed = (): void => {};
		window.console.groupEnd = (): void => {};
		window.console.warn = (): void => {};
		window.console.error = (): void => {};
	}
};

if (environment.production) {
  enableProdMode();
}
if (environment.disableConsole) {
  disableConsole();
}

document.addEventListener('DOMContentLoaded', () => {
	platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.catch(err => console.log(err));
});
