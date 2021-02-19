import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation,
  Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
// services
import { SharedService } from '@app/services/shared.service';

import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';

@Component({
  selector: 'app-global-preloader',
  templateUrl: './global-preloader.component.html',
  styleUrls: ['./global-preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class GlobalPreloaderComponent implements OnInit {

  public homePath: string;
  public modelLang: string;
  public isMatSelectOpen = false;
  public userActive: boolean;
  private preloader = this.document.getElementsByTagName('app-global-preloader')[0] as HTMLElement;
  private subsGlobalEventStore: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
              public sharedService: SharedService,
              private store: Store<AppState>,) {
  }

  public ngOnInit(): void {
    this.preloader.classList.add('off');
    this.subsGlobalEventStore = this.store.select('globalEvent').subscribe(({loadingPageContent}) =>
      loadingPageContent ? this.preloader.classList.remove('off') : this.preloader.classList.add('off')
    );
  }
}
