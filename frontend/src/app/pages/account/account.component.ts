import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { GetUserAction } from '@app/store/actions/user.action';
import { LoadGlobalEventAction } from '@app/store/actions/globalEvent.action';
import { FORM_VALIDATORS } from '@app/DATA/errors-message';
import IUserModel from '@app/interfaces/store.models/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Event } from '@angular/router';
import { ViewChild } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;
  public user: IUserModel = null;
  public cardHeader = '/assets/images/account/account_card_head.jpg';
  public cardUser = '/assets/images/account/avatar-exemple.png';
  public mainForm: FormGroup;
  public passwordForm: FormGroup;
  public inputErrors: string[];
  private subsUserStore: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    public sharedService: SharedService,
    private store: Store<AppState>) {

    this.mainForm = this.fb.group({
      emailInput: new FormControl('', Validators.compose([Validators.email])),
      firstNameInput: new FormControl('', Validators.required),
      lastNameInput: new FormControl('', Validators.required),
    });

    this.passwordForm = this.fb.group({
      passwordFirstInput: new FormControl(''),
      passwordSecondInput: new FormControl(''),
    }, {validators: this.checkPasswords});
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetUserAction());
    this.store.dispatch(new LoadGlobalEventAction());

    this.activeRoute.data.subscribe(data => {
      this.inputErrors = FORM_VALIDATORS.find(obj => data.page === obj.url)[data.lang];
    });

    this.subsUserStore = this.store.select('userInfo').subscribe(({user, loading}) => {
      if (user) {
        this.user = user;
        this.initMainForm();
      }
      console.log(user, loading);
      this.cdRef.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.subsUserStore.unsubscribe();
  }

  public checkPasswords(registerForm: FormGroup): any | null {
    const firstpassword = registerForm.get('passwordFirstInput').value;
    const confirmPassword = registerForm.get('passwordSecondInput').value;

    return firstpassword === confirmPassword ? null : { notSamePassword: true };
  }

  public uploadAvatar(event: any) {
    const imgFile = event.target as HTMLInputElement;
    if (imgFile.files && imgFile.files[0]) {
      const imgType = imgFile.files[0].type;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = (rs: any) => {
          const height = rs.path[0].naturalHeight;
          const width = rs.path[0].naturalWidth;
          if (height > 750 || width > 750) {
            this.sharedService.setGlobalEventData(this.inputErrors[2], 'error-window');
            this.fileInput.nativeElement.value = '';
            return false;
          };

          const imgBase64Path = e.target.result;
          //here method if all ok
          console.log(imgBase64Path, imgType, this.user.email);
        };

        image.onerror = () => {
          this.sharedService.setGlobalEventData(this.inputErrors[3], 'error-window');
          this.fileInput.nativeElement.value = '';
          return false;
        };
      };
      reader.readAsDataURL(imgFile.files[0]);
    } else {
      this.sharedService.setGlobalEventData(this.inputErrors[4], 'error-window');
    };
  };

  public onSubmitEditMainData(event: Event): void {

  };


  private initMainForm() {
    this.mainForm.controls.firstNameInput.setValue(this.user.firstName);
    this.mainForm.controls.lastNameInput.setValue(this.user.lastName);
    this.mainForm.controls.emailInput.setValue(this.user.email);
  };

}
