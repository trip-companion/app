import { Component, OnInit, PLATFORM_ID, Inject, } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { isPlatformBrowser, Location } from '@angular/common';
import { LocationService } from './services/location.service';
import { SharedService } from './services/shared.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isCollapsed = false;
  public isBrowser: boolean;
  public isShowContactsComponent = true;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              public sharedService: SharedService,
              private locationService: LocationService,
              private location: Location,
              private router: Router,
              private stateService: StateService,) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.sharedService.updatePrevRout(events[0].urlAfterRedirects);
      });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event instanceof NavigationCancel) {
          const PATH: string = this.locationService.PATH;
          if (!/[^\/]\/$/.test(PATH)) {
            this.location.replaceState(`${PATH}/`);
          }
          console.log(`:::::::: NavigationCancel`);
        }

        if (event instanceof NavigationEnd) {
          if (this.isBrowser) {
            this.setAdvString();
            window.document.querySelector('#wrapper').scrollIntoView(true); //this work in FF70+
            console.groupCollapsed(`%c>>>>>>>>>>>>>>>>>>>>>>>>>>>> NavigationEnd`, 'color:#fb5258;font-size:12px;');
            console.groupEnd();
          } else {
            console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>> NavigationEnd`);
          }
        }
        this.stateService.isToggleSidebar.next(false);
      }
    });
  }

  public ngOnInit(): void {

  }

  public setAdvString(): void {
    const queryString = this.isBrowser ? window.location : null;
    this.isShowContactsComponent = !/\/contacts$/.test(this.router.url);
    const PATH: string = this.locationService.PATH;

    if (queryString.href.includes('?')) {
      const advStr = this.router.url.split('?');
      this.location.replaceState(`${PATH}/?${advStr[1]}`);
    } else {
      if (!/[^\/]\/$/.test(PATH)) { this.location.replaceState(`${PATH}/`); }
    }
  }
}
