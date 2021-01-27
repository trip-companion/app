import { Component, OnInit, PLATFORM_ID, Inject,} from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { isPlatformBrowser, DOCUMENT, Location } from '@angular/common';

import { LocationService } from './services/location.service';
import { SharedService } from './services/shared.service';
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isCollapsed = false;
  public isBrowser: boolean;
  public isShowContactsComponent: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public sharedService: SharedService,
    private locationService: LocationService,
    private location: Location,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log("prev rout is: ", events[0].urlAfterRedirects)
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {

        if (event instanceof NavigationCancel) {
          const PATH: string = this.locationService.PATH;
          if (!/[^\/]\/$/.test(PATH)) { 
            this.location.replaceState(`${PATH}/`);
          }
          console.log(`:::::::: NavigationCancel`);
        };

        if (event instanceof NavigationEnd) {
          if (this.isBrowser) {
            this.setAdvString();
            //window.document.querySelector('#wrapper').scrollIntoView(true); //this work in FF70+ 
            console.groupCollapsed(`%c>>>>>>>>>>>>>>>>>>>>>>>>>>>> NavigationEnd`, 'color:#fb5258;font-size:12px;');
            console.groupEnd();
          } else {
              console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>> NavigationEnd`);
          }
        };

      }
    });

  }

  public ngOnInit(): void {
    const PATH: string = this.locationService.PATH;
    console.log("this path is: ", PATH)
  }
  
  public setAdvString(): void {
    //	const sourceLinks = ['gclid', 'gclsrc', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      let queryString = this.isBrowser ? window.location : null;
      this.isShowContactsComponent = !/\/contacts$/.test(this.router.url);
      const PATH: string = this.locationService.PATH;
  
      if(queryString.href.includes('?')) {
        let advStr= this.router.url.split("?");
        this.location.replaceState(`${PATH}/?${advStr[1]}`);
      } else {
        if (!/[^\/]\/$/.test(PATH) ) { this.location.replaceState(`${PATH}/`); }
      }
    }

}
