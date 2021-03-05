import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { UpdateUserAction } from '@app/store/actions/user.action';
import { LoadGlobalEventAction } from '@app/store/actions/globalEvent.action';
import { FORM_VALIDATORS } from '@app/DATA/errors-message';

import IUserModel from '@app/interfaces/store.models/user.model';
import { UserModel } from '@app/models/edit-user.model';
import { IAcountUserData } from '@app/interfaces/store.models/accountUserData.model';
import IPageDataModel from '@app/interfaces/store.models/pageData.model';

import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Event } from '@angular/router';
import { ViewChild } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ApiService } from '@app/services/api.services';
import { LoadAccountUserDataAction } from '@app/store/actions/accountUserAboutData.action';
//data
import { ENUM_USER_SKILL, STATUS_LIST, LANGUAGE_LVL_LIST, GENDER_LIST} from '@app/DATA/account-data';
import { IUserSkillsKnowladgeList } from '@app/interfaces/account-page';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('interestInput') interestInput: ElementRef<HTMLInputElement>;
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('languageInput') languageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('skillsAuto') matAutocompleteSkills: MatAutocomplete;

  public user: IUserModel = null;
  public userAbout: IAcountUserData = null;
  public accountStaticData: IPageDataModel = null;
  public userStatuses: string[] = [];

  public lvlOfKnowledgeLanguage: string[] = [];
  public userLanguageKnowledge: Array<{isoCode: string; level: string}> = [];
  public availableLanguagesForUser: {isoCode: string; displayName: string}[] = [];
  public availableLanguages: {isoCode: string; displayName: string}[] = [];
  public choicesLvlOfLang: string;
  public languageName: string;

  public userGender: string[] = [];;;;;;;;;;;;;;;;;;;;;;;;;;;;

  public lvlOfKnowledgeSkill = [];
  public choicesLvlOfSkill: string;
  public userSkillsKnowladgeList: IUserSkillsKnowladgeList[] = [];
  public availableSkillsForUser: {id: string; displayName: string}[];
  public availableSkills: {id: string; displayName: string}[];

  public availableInterestsForUser: {id: string; displayName: string}[];
  public availableInterests: {id: string; displayName: string}[];
  public userInterestsChoices: string[];

  public accountFeatures: {id: string; displayName: string}[];
  public currentUserFeatures: string[] = [];

  public startDate: Date = new Date();
  public minSearchDate: Date = new Date(this.startDate.setFullYear(new Date().getFullYear() -16));
  public dateOfBirth: number;

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  //test
  public cardHeader = '/assets/images/account/account_card_head.jpg';
  public cardUser = '/assets/images/account/avatar-hover.png';
  public passwordForm: FormGroup;
  public mainForm: FormGroup;
  public interestsForm = new FormControl();
  public skillsForm = new FormControl('', Validators.compose([Validators.required]));
  public languageForm = new FormControl('', Validators.compose([Validators.required]));
  public emailForm = new FormControl('', Validators.compose([Validators.email]));
  public inputErrors: string[];

  private subsAccountUserStore: Subscription = new Subscription();
  private subsInterestInput: Subscription = new Subscription();
  private subsSkillsInput: Subscription = new Subscription();
  private subsLanguagesInput: Subscription = new Subscription();
  private subsPageData: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    public sharedService: SharedService,
    private store: Store<AppState>,
    private apiSvc: ApiService) {

    this.mainForm = this.fb.group({
      firstNameInput: new FormControl('', Validators.required),
      lastNameInput: new FormControl('', Validators.required),
      userStatusRadio: new FormControl('', Validators.required),
      dateOfBirthInput: new FormControl(''),
      descriptionTextarea: new FormControl(''),
      userGenderRadio:  new FormControl(''),
    });

    this.passwordForm = this.fb.group({
      passwordFirstInput: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/\d/),
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(\S*\s){0,0}\S*$/),
        Validators.pattern(/[!#$%&'"()*+,-./:;<=>?@_`{|}~\[\]]/),
      ])),
      passwordSecondInput: new FormControl('', Validators.required),
    }, {validators: this.checkPasswords});

    this.inputErrors = FORM_VALIDATORS.find(obj => 'account/' === obj.url)[this.sharedService.language];
  }

  public ngOnInit() {

    this.subsPageData = this.activeRoute.data.subscribe(data => {
      if(data.pageContent.page) {
        this.accountStaticData = data.pageContent.page;
        this.store.dispatch(new LoadGlobalEventAction());
        this.store.dispatch(new LoadAccountUserDataAction());

        this.setOptionListFromArr(STATUS_LIST,
          this.accountStaticData.mappings.personalInfo.detailsInfo.status,
          this.userStatuses);

        this.setOptionListFromArr(GENDER_LIST,
          this.accountStaticData.mappings.personalInfo.detailsInfo.gender,
          this.userGender);

        this.setOptionFromEnumData(this.sharedService.language, this.lvlOfKnowledgeSkill, ENUM_USER_SKILL);
        this.choicesLvlOfSkill = this.lvlOfKnowledgeSkill[0];

        this.setOptionListFromArr(LANGUAGE_LVL_LIST,
          this.accountStaticData.mappings.personalInfo.detailsInfo.languages,
          this.lvlOfKnowledgeLanguage);
        this.choicesLvlOfLang = this.lvlOfKnowledgeLanguage[0];
      };
    });

    this.subsAccountUserStore = combineLatest([
      this.store.pipe(select('userInfo', 'user')),
      this.store.pipe(select('accountAboutData', 'data')),
    ]).subscribe((store)=> {
      if(store[0] && store[1]) {
        this.user = store[0];
        this.userAbout = store[1];
        this.initMainUserData(this.sharedService.language);
      }
    });

    this.subsInterestInput = this.interestsForm.valueChanges.subscribe(value => {
      if(value && this.availableInterestsForUser.length > 0) {
        this.availableInterestsForUser = this.filterInterests(value);
      } else {
        this.setAvailableInterestsForUser();
      }
    });

    this.subsSkillsInput = this.skillsForm.valueChanges.subscribe(value => {
      if(value && this.availableSkillsForUser.length > 0) {
        this.availableSkillsForUser = this.filterSkills(value);
      } else {
        this.setAvailableSkillsForUser();
      }

      this.skillsForm.setErrors(this.checkAvailableSkillsForUser(value)? (null): {'invalid skill': true});
    });

    this.subsLanguagesInput = this.languageForm.valueChanges.subscribe(value => {
      if(value && this.availableLanguagesForUser.length>0) {
        this.availableLanguagesForUser = this.filterLanguages(value);
      } else {
        this.setAvailableLanguagesForUser();
      }

      this.languageForm.setErrors(this.checkAvailableLangList(value)? (null): {'invalid lang': true});
    });
  }

  public ngOnDestroy(): void {
    this.subsPageData.unsubscribe();
    this.subsInterestInput.unsubscribe();
    this.subsSkillsInput.unsubscribe();
    this.subsLanguagesInput.unsubscribe();
    this.subsAccountUserStore.unsubscribe();
  }

  public checkPasswords(passwordForm: FormGroup): any | null {
    const firstpassword = passwordForm.get('passwordFirstInput').value;
    const confirmPassword = passwordForm.get('passwordSecondInput').value;

    return firstpassword === confirmPassword ? null : { notSamePassword: true };
  }

  public onSubmitMainData(event: Event): void {
    const userForSend = new UserModel();
    userForSend.firstName = this.mainForm.controls.firstNameInput.value;
    userForSend.lastName = this.mainForm.controls.lastNameInput.value;
    userForSend.birthDate = this.mainForm.controls.dateOfBirthInput.value.format('YYYY-MM-DD');
    userForSend.about = this.mainForm.controls.descriptionTextarea.value;
    userForSend.status = this.returnNameObjectByValue(
      this.mainForm.controls.userStatusRadio.value,
      this.accountStaticData.mappings.personalInfo.detailsInfo.status);
    userForSend.gender = this.returnNameObjectByValue(
      this.mainForm.controls.userGenderRadio.value,
      this.accountStaticData.mappings.personalInfo.detailsInfo.gender);
    userForSend.features = this.currentUserFeatures;
    userForSend.interests = this.userInterestsChoices;
    userForSend.languages = this.userLanguageKnowledge;
    this.userSkillsKnowladgeList.forEach(skillObj => {
      userForSend[skillObj.category] = skillObj.list.map(obj => obj.id);
    });
    this.store.dispatch(new LoadGlobalEventAction());
    this.store.dispatch(new UpdateUserAction(userForSend));
  };

  public onSubmitChangePassword(event: Event): void {

  };

  public onSubmitEditEmail(event: Event): void {

  }
  ///////////////////////////////////////////////////////////
  //img avatar  start
  public changeUserAvatar(): void {
    if(this.user.avatarSrc && this.user.avatarSrc.length > 1) {
      this.cardUser = this.sharedService.getCorrectImg(this.user.avatarSrc);
    };
  }

  public uploadAvatar(event: InputEvent) {
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
          this.apiSvc.postUserAvatar(imgFile.files[0])
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
  //img avatar end
  //features start
  public changeFeatures(id: string, status: boolean): void {
    if(status) {
      this.currentUserFeatures = this.currentUserFeatures.filter(name => name !== id);
    } else {
      this.currentUserFeatures = [...this.currentUserFeatures, id];
    }
    this.cdRef.detectChanges();
  }
  //features end
  //skill start
  public setKnowledgeUserSkills(): void {
    this.userSkillsKnowladgeList = [];
    for (const property in ENUM_USER_SKILL) {
      if(property) {
        const customArr = this.availableSkills.filter(({id: allskillId}) => this.user[property].find(idStr => idStr === allskillId));
        this.userSkillsKnowladgeList.push(
          {
            category: property,
            name: ENUM_USER_SKILL[property][this.sharedService.language],
            list: customArr
          }
        );
      }
    };
  }

  public setAvailableSkillsForUser(): void {
    const newArr = !this.userSkillsKnowladgeList.find(obj => obj.list.length > 0)
      ? this.availableSkills
      : this.availableSkills.filter(({ id: allSkillsId }) =>
        !this.userSkillsKnowladgeList.find((category) =>
          category.list.find(listItem => allSkillsId === listItem.id)));

    this.availableSkillsForUser = newArr;
  }

  public checkAvailableSkillsForUser(skillName: string): any {
    return this.availableSkills.find(skill => skill.displayName === skillName);
  }

  public addNewUserSkill(event: Event): void {
    const inputvalue = this.skillInput.nativeElement.value;
    const findInArr = this.availableSkillsForUser.find(skill => skill.displayName.toLocaleLowerCase() === inputvalue.toLocaleLowerCase());
    const lvlIndex = this.lvlOfKnowledgeSkill.findIndex(item => item === this.choicesLvlOfSkill);
    this.userSkillsKnowladgeList[lvlIndex].list.push(findInArr);
    this.setAvailableSkillsForUser();
    this.skillInput.nativeElement.value = '';
    this.skillInput.nativeElement.blur();
    this.skillsForm.setValue(null);
  }

  public deleteCurrentSkill(categoryIndex: number, indexInList: number): void {
    this.userSkillsKnowladgeList[categoryIndex].list.splice(indexInList, 1);
    this.setAvailableSkillsForUser();
  }

  public filterSkills(value: string): any {
    const filterValue = value.toLowerCase();
    return this.availableSkillsForUser.filter(skill => skill.displayName.toLowerCase().indexOf(filterValue) === 0);
  }
  //skill end
  //lang start
  public filterLanguages(value: string): any {
    const filterValue = value.toLowerCase();
    return this.availableLanguagesForUser.filter(lang => lang.displayName.toLowerCase().indexOf(filterValue) === 0);
  }

  public checkAvailableLangList(langName: string): any {
    const findStrInAllLang = this.availableLanguagesForUser.find(lang => lang.displayName === langName);
    return findStrInAllLang;
  }

  public addNewUserLanguage(event: Event): void {
    const inputvalue = this.languageInput.nativeElement.value;
    const findInArr = this.availableLanguagesForUser.find(lang => lang.displayName.toLocaleLowerCase() === inputvalue.toLocaleLowerCase());
    const lvlIndex = this.lvlOfKnowledgeLanguage.findIndex(item => item === this.choicesLvlOfLang);
    if(findInArr) {
      this.userLanguageKnowledge
        .push({
          isoCode: findInArr.isoCode,
          level: LANGUAGE_LVL_LIST[lvlIndex],
        });
      this.languageInput.nativeElement.value = '';
      this.languageForm.setValue(null);
      this.languageInput.nativeElement.blur();
    };
    this.setAvailableLanguagesForUser();
  }

  public deleteCurrentLang(index: number, iso: string): void {
    this.userLanguageKnowledge.splice(index, 1);
    this.setAvailableLanguagesForUser();
  }

  public setAvailableLanguagesForUser(): void {
    const newArr = this.userLanguageKnowledge.length === 0
      ? this.availableLanguages
      : this.availableLanguages.filter(({ isoCode: id1 }) => !this.userLanguageKnowledge.find(({ isoCode: id2 }) => id2 === id1));

    this.availableLanguagesForUser = newArr;
  }
  //lang end
  //interests start
  public setAvailableInterestsForUser(): void {
    const newArr = this.userInterestsChoices.length === 0
      ? this.availableInterests
      : this.availableInterests.filter(({ id: idInall}) => !this.userInterestsChoices.find((currentId) => currentId === idInall));

    this.availableInterestsForUser = newArr;
  }

  public checkAvailableInterestsList(interesName: string) {
    const findStrInAllInterests = this.availableInterestsForUser.find(interes => interes.displayName === interesName);
    return findStrInAllInterests;
  }

  public selectedInterest(event: MatAutocompleteSelectedEvent): void {
    this.userInterestsChoices.push(this.availableInterests.find(interest => interest.displayName === event.option.viewValue).id);
    this.interestInput.nativeElement.value = '';
    this.interestsForm.setValue(null);
    this.interestInput.nativeElement.blur();
    this.setAvailableInterestsForUser();
  }

  public removeInterest(interest: string): void {
    const index = this.userInterestsChoices.indexOf(interest);
    if (index >= 0) {
      this.userInterestsChoices.splice(index, 1);
      this.setAvailableInterestsForUser();
    }
  }

  private filterInterests(value: string): any {
    const filterValue = value.toLowerCase();
    return this.availableInterestsForUser.filter(interest => interest.displayName.toLowerCase().indexOf(filterValue) === 0);
  }
  //interests end
  private initMainUserData(lang: string) {
    this.changeUserAvatar();
    //form
    this.mainForm.controls.firstNameInput.setValue(this.user.firstName);
    this.mainForm.controls.lastNameInput.setValue(this.user.lastName);
    this.mainForm.controls.dateOfBirthInput.setValue(moment(this.user.birthDate));
    this.mainForm.controls.descriptionTextarea.setValue(this.user.about);
    // accountStaticData.mappings.personalInfo.detailsInfo.gender
    this.mainForm.controls.userGenderRadio.setValue(this.accountStaticData.mappings.personalInfo.detailsInfo.gender[this.user.gender].text);
    // accountStaticData.mappings.personalInfo.detailsInfo.status
    this.mainForm.controls.userStatusRadio.setValue(this.accountStaticData.mappings.personalInfo.detailsInfo.status[this.user.status].text);
    this.emailForm.setValue(this.user.email);
    //lang
    // accountStaticData.mappings.personalInfo.detailsInfo.languages
    this.userLanguageKnowledge = this.user.languages.slice();
    this.availableLanguages = this.userAbout.languages;
    this.setAvailableLanguagesForUser();
    //skills
    // accountStaticData.mappings.personalInfo.detailsInfo.skills.
    this.availableSkills = this.userAbout.skills;
    this.setKnowledgeUserSkills();
    this.setAvailableSkillsForUser();
    //interests
    this.availableInterests = this.userAbout.interests;
    this.userInterestsChoices = this.user.interests.slice();
    this.setAvailableInterestsForUser();
    //features
    this.accountFeatures = this.userAbout.features;
    this.currentUserFeatures = this.user.features.slice();

    this.cdRef.detectChanges();
  };

  private setOptionFromEnumData(lang: string, arr: string[], enumObj: any): void {
    for (const props in enumObj) {
      if(props) {
        arr.push(enumObj[props][lang]);
      }
    }
  };

  private setOptionListFromArr(listOfVaribales: string[], objectFromBackEnd: any, arrForUi: string[]): void {
    listOfVaribales.forEach(item => {
      arrForUi.push(objectFromBackEnd[item].text);
    });
  };

  private returnNameObjectByValue(value: string, enumObj: any): string {
    for (const props in enumObj) {
      if(enumObj[props].text === value) {return props;}
    }
  };
}
