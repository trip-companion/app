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
import { ViewChild } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ApiService } from '@app/services/api.services';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('interestInput') interestInput: ElementRef<HTMLInputElement>;
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('skillsAuto') matAutocompleteSkills: MatAutocomplete;

  public userStatuses: string[] = ['At home', 'Travelling', 'Travel search'];
  public userStatus: string = this.userStatuses[0];
  public startDate: Date = new Date();
  public minSearchDate: Date = new Date(this.startDate.setFullYear(new Date().getFullYear() -16));
  public dateOfBirth: number;
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public allInterests: string[] = INTERESTS_DATA[this.sharedService.language];
  public filtredInterests: string[];
  public choicesInterests: string[] = ['Yoga'];
  public lvlOfKnowledgeLanguage = ['Elementary', 'Intermediate', 'Advanced', 'Fluent'];
  public choicesLvlOfLang: string = this.lvlOfKnowledgeLanguage[0];
  public languageName: string;
  public userLanguageKnowledge: Array<{name: string; lvl: number}> = [
    {
      name: 'English',
      lvl: 3
    },
    {
      name: 'Ukraine',
      lvl: 2
    }
  ];
  public filtredSkills: string[];
  public skillsArr: string[] = ['skill1', 'skill2', 'skill3', 'skill4',
    'skill5', 'skill6', 'fskill7', 'fskill8', 'zzzskill9', 'gggskill10'];
  public lvlOfKnowledgeSkill = ['Can teach', 'Some knowledge of', 'I want to learn'];
  public choicesLvlOfSkill: string = this.lvlOfKnowledgeSkill[0];
  public choicesSkills = [
    {
      name: 'Can teach',
      list: [
        'skill1'
      ]
    },
    {
      name: 'Some knowledge of',
      list: [
        'skill4',
        'skill5'
      ]
    },
    {
      name: 'I want to learn',
      list: [
      ]
    },
  ];
  public moreInfo = [
    {
      name:'Smoker',
      status: false
    },
    {
      name:'Driver`s licence',
      status: true
    },
    {
      name:'Travel with animal',
      status: false
    },
    {
      name:'Special dietary requirements',
      status: false
    }
  ];
  //test
  public user: IUserModel = null;
  public cardHeader = '/assets/images/account/account_card_head.jpg';
  public cardUser = '/assets/images/account/avatar-exemple.png';
  public mainForm: FormGroup;
  public passwordForm: FormGroup;
  public interestsForm = new FormControl();
  public skillsForm = new FormControl('', Validators.compose([Validators.required]));
  public inputErrors: string[];

  private subsUserStore: Subscription = new Subscription();
  private subsInterestInput: Subscription = new Subscription();
  private subsSkillsInput: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    public sharedService: SharedService,
    private store: Store<AppState>,
    private apiSvc: ApiService,) {
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

  public ngOnInit() {
    this.store.dispatch(new GetUserAction());
    this.store.dispatch(new LoadGlobalEventAction());
    this.filtredSkills = this.excludeSelectedSkill();
    this.filtredInterests = this.excludeSelectedInterest();

    this.activeRoute.data.subscribe(data => {
      this.inputErrors = FORM_VALIDATORS.find(obj => data.page === obj.url)[data.lang];
    });

    this.subsInterestInput = this.interestsForm.valueChanges.subscribe(value => {
      this.filtredInterests = value ? this.filterInterests(value) : this.excludeSelectedInterest();
    });

    this.subsSkillsInput = this.skillsForm.valueChanges.subscribe(value => {
      this.filtredSkills = value ? this.filterSkills(value) : this.excludeSelectedSkill();
      this.skillsForm.setErrors(this.checkSkill(value)? (null): {'invalid skill': true});
    });

    this.subsUserStore = this.store.select('userInfo').subscribe(({user, loading}): void => {
      if (user) {
        this.user = user;
        this.initMainForm();
      }
    });
  }

  public ngOnDestroy(): void {
    this.subsUserStore.unsubscribe();
    this.subsInterestInput.unsubscribe();
    this.subsSkillsInput.unsubscribe();
  }

  public checkSkill(skillName: string): any {
    return this.filtredSkills.find(skill => skill === skillName);
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

  public addNewUserSkill(event: Event): void {
    this.choicesSkills.find(obj => {
      if(obj.name === this.choicesLvlOfSkill) {obj.list.push(this.skillsForm.value);}
    });
    this.filtredSkills = this.excludeSelectedSkill();
    this.skillInput.nativeElement.value = '';
    this.skillInput.nativeElement.blur();
    this.skillsForm.setValue(null);
  }

  public deleteCurrentSkill(categoryName: string, indexInCategory: number): void {
    const indexInArr = this.choicesSkills.findIndex(category => category.name === categoryName);
    this.choicesSkills[indexInArr].list.splice(indexInCategory, 1);
    this.filtredSkills = this.excludeSelectedSkill();
  }

  public addNewUserLanguage(event: Event): void {
    const findInArr = this.userLanguageKnowledge.find(lang => lang.name.toLocaleLowerCase() === this.languageName.toLocaleLowerCase());
    if(!findInArr) {this.userLanguageKnowledge
      .push({name: this.languageName,
        lvl: this.lvlOfKnowledgeLanguage.findIndex(item => item === this.choicesLvlOfLang)
      });}
  }

  public deleteCurrentLang(index: number): void {
    this.userLanguageKnowledge.splice(index, 1);
  }

  public selectedInterest(event: MatAutocompleteSelectedEvent): void {
    this.choicesInterests.push(event.option.viewValue);
    this.interestInput.nativeElement.value = '';
    this.interestsForm.setValue(null);
    this.interestInput.nativeElement.blur();
    this.filtredInterests = this.excludeSelectedInterest();;
  }

  public removeInterest(interest: string): void {
    const index = this.choicesInterests.indexOf(interest);
    if (index >= 0) {
      this.choicesInterests.splice(index, 1);
      this.filtredInterests = this.excludeSelectedInterest();
    }
  }

  private filterInterests(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.excludeSelectedInterest().filter(interest => interest.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterSkills(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.excludeSelectedSkill().filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);

  }

  private excludeSelectedSkill(): string[] {
    const arrTmp: string[] = [];
    this.choicesSkills.forEach(obj => obj.list.map(item => arrTmp.push(item)));
    return this.skillsArr.filter(skill => arrTmp.indexOf(skill) === -1);
  }

  private excludeSelectedInterest(): string[] {
    return this.allInterests.filter(item => this.choicesInterests.indexOf(item) === -1);
  };
  ///////////////////////////////////////////////////////
  private initMainForm() {
    this.mainForm.controls.firstNameInput.setValue(this.user.firstName);
    this.mainForm.controls.lastNameInput.setValue(this.user.lastName);
    this.mainForm.controls.emailInput.setValue(this.user.email);
    this.changeUserAvatar();
    this.cdRef.detectChanges();
  };

}
