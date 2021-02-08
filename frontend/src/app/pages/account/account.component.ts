import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { AppState } from '@app/store/app.state';
import { Observable , Subscription} from 'rxjs';
import { LoadUserAction } from '@app/store/actions/user.action';

@Component({
  selector: 'account-faq',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  //Variable for ngrx
	public loading$: Observable<boolean>;
	public error$: Observable<Error>;
  private subsUserStore: Subscription = new Subscription();
  
  constructor(@Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef,
		private store: Store<AppState>) { }


  public ngOnInit() {
    this.store.dispatch(new LoadUserAction());
		
	  this.subsUserStore = this.store.select('userInfo').subscribe(({user, loading, error}) => {
			console.log(user, loading, error)
			this.cdRef.detectChanges();
		})
  }

  public ngOnDestroy(): void {
		this.subsUserStore.unsubscribe();
	};

}
