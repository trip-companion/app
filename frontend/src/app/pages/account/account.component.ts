import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { GetUserAction } from '@app/store/actions/user.action';
import { LoadGlobalEventAction } from '@app/store/actions/globalEvent.action';
import { FORM_VALIDATORS } from '@app/DATA/errors-message';
import { INTERESTS_DATA } from '@app/DATA/Interests-data';
import IUserModel from '@app/interfaces/store.models/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Event } from '@angular/router';
import { of } from 'rxjs';
import { ViewChild } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ApiService } from '@app/services/api.services';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('interestInput') interestInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  public userStatuses: string[] = ['At home', 'Travelling', 'Travel search'];
  public userStatus: string = this.userStatuses[0];
  public startDate: Date = new Date();
  public minSearchDate: Date = new Date(this.startDate.setFullYear(new Date().getFullYear() -16));
  public dateOfBirth: string;
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public interestsForm = new FormControl();
  public allInterests: string[] = INTERESTS_DATA[this.sharedService.language];
  public filteredInterests: Observable<string[]>;
  public choicedInterests: string[] = ['Yoga'];
  //test
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
    private store: Store<AppState>,
    private apiSvc: ApiService,) {
    this.filteredInterests = this.interestsForm.valueChanges.pipe(
      startWith(null),
      map((interest: string | null) => interest ? this.filterInterests(interest) : this.excludeSelectedInterest()));
    this.mainForm = this.fb.group({
      emailInput: new FormControl('', Validators.compose([Validators.email])),
      firstNameInput: new FormControl('', Validators.required),
      lastNameInput: new FormControl('', Validators.required),
    });

    this.passwordForm = this.fb.group({
      passwordFirstInput: new FormControl('', Validators.required),
      passwordSecondInput: new FormControl('', Validators.required),
    }, {validators: this.checkPasswords});
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetUserAction());
    this.store.dispatch(new LoadGlobalEventAction());

    this.activeRoute.data.subscribe(data => {
      this.inputErrors = FORM_VALIDATORS.find(obj => data.page === obj.url)[data.lang];
    });

    this.subsUserStore = this.store.select('userInfo').subscribe(({user, loading}): void => {
      if (user) {
        this.user = user;
        this.initMainForm();
        console.log(this.user);
      }
      this.cdRef.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.subsUserStore.unsubscribe();
  }

  public checkPasswords(passwordForm: FormGroup): any | null {
    const firstpassword = passwordForm.get('passwordFirstInput').value;
    const confirmPassword = passwordForm.get('passwordSecondInput').value;

    return firstpassword === confirmPassword ? null : { notSamePassword: true };
  }

  public changeUserAvatar(): void {
    if(this.user.avatarSrc.length > 1) {
      this.cardUser = this.sharedService.getCorrectImg(this.user.avatarSrc);
    };
  }

  public uploadAvatar(event: any) {
    const imgFile = event.target as HTMLInputElement;
    if (imgFile.files && imgFile.files[0]) {
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
          this.apiSvc.putUserAvatar(imgFile.files[0])
            .subscribe((updatedUser: IUserModel) => {
              this.user = updatedUser;
              this.changeUserAvatar();
            }, error => console.log(error));
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

  public onSubmitChangePassword(event: Event): void {

  };

  public onSubmitEditAboutMeData(event: Event): void {

  };
  ///////////////////////////////////////////////////////////

  public selectedInterest(event: MatAutocompleteSelectedEvent): void {
    this.choicedInterests.push(event.option.viewValue);
    this.interestInput.nativeElement.value = '';
    this.interestsForm.setValue(null);
    this.interestInput.nativeElement.blur();
    this.filteredInterests = of(this.excludeSelectedInterest());
  }

  public removeInterest(interest: string): void {
    const index = this.choicedInterests.indexOf(interest);
    if (index >= 0) {
      this.choicedInterests.splice(index, 1);
      this.filteredInterests = of(this.excludeSelectedInterest());
      this.cdRef.detectChanges();
    }
  }

  private filterInterests(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.excludeSelectedInterest().filter(interest => interest.toLowerCase().indexOf(filterValue) === 0);
  }

  private excludeSelectedInterest(): string[] {
    return this.allInterests.filter(item => this.choicedInterests.indexOf(item) === -1);
  };
  ///////////////////////////////////////////////////////
  private initMainForm() {
    this.mainForm.controls.firstNameInput.setValue(this.user.firstName);
    this.mainForm.controls.lastNameInput.setValue(this.user.lastName);
    this.mainForm.controls.emailInput.setValue(this.user.email);
    this.changeUserAvatar();
  };

}
