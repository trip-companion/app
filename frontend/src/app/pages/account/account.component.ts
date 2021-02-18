import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { GetUserAction } from '@app/store/actions/user.action';
import { LoadGlobalEventAction } from '@app/store/actions/globalEvent.action';

import IUserModel from '@app/interfaces/store.models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  public user: IUserModel = null;
  private subsUserStore: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
              private cdRef: ChangeDetectorRef,
              private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetUserAction());
    this.store.dispatch(new LoadGlobalEventAction());

    this.subsUserStore = this.store.select('userInfo').subscribe(({user, loading}) => {
      if (user) { this.user = user; }
      this.cdRef.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.subsUserStore.unsubscribe();
  }

}
