import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { SharedService } from '@app/services/shared.service';
import { LocationService } from '@app/services/location.service';

import { FORM_VALIDATORS } from '@app/DATA/errors-message';
import ILocalizationText from '../../interfaces/localization-text';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public registerForm: FormGroup;
  public inputErrors: string[];
  public homePath = this.locationService.extractBasePATH();
  public successMessage: ILocalizationText = {
    ru: 'Регистрация успешна, залогиньтесь.',
    ua: 'Реєстрація успішна, залогіньтесь.',
    en: 'Registration successful, please login.'
  };

  constructor(private fb: FormBuilder,
  public cdr: ChangeDetectorRef,
  private activeRoute: ActivatedRoute,
  private route: ActivatedRoute,
  public locationService: LocationService,
  private router: Router,
  public sharedService: SharedService,
  private authenticationService: AuthenticationService
  ) {
    this.registerForm = this.fb.group({
      emailInput: new FormControl('123@ukr.net', Validators.compose([Validators.email, Validators.required])),
      firstNameInput: new FormControl('Lalala', Validators.required),
      lastNameInput: new FormControl('GGGG333', Validators.required),
      passwordFirstInput: new FormControl('1235', Validators.compose([
        Validators.required,
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/\d/),
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(\S*\s){0,0}\S*$/),
        Validators.pattern(/[!#$%&'"()*+,-./:;<=>?@_`{|}~\[\]]/),
      ])),
      passwordSecondInput: new FormControl('1235', Validators.required),
    }, { validators: this.checkPasswords });
    if (this.authenticationService.tokenValue) {
      this.router.navigate([this.homePath]);
    }
  }

  public ngOnInit(): void {
    this.activeRoute.data.subscribe(data => {
      this.inputErrors = FORM_VALIDATORS.find(obj => data.page === obj.url)[data.lang];
    });
    this.returnUrl = this.sharedService.globalPrevRout || this.homePath;
    // this.registerForm.valueChanges.subscribe(data => {
    //   console.log(this.registerForm.controls.passwordFirstInput.errors.pattern)
    // })
  }

  public checkPasswords(registerForm: FormGroup): any | null {
    const firstpassword = registerForm.get('passwordFirstInput').value;
    const confirmPassword = registerForm.get('passwordSecondInput').value;
    return firstpassword === confirmPassword ? null : { notSamePassword: true };
  }

  get getReginsterFormControls(): {[key: string]: any} | null { return this.registerForm.controls; }

  public onSubmitRegister(event: Event): void {
    this.submitted = true;
    if (this.registerForm.invalid) { return; }
    this.loading = true;
    this.authenticationService.singUp(
      this.getReginsterFormControls.emailInput.value,
      this.getReginsterFormControls.firstNameInput.value,
      this.getReginsterFormControls.lastNameInput.value,
      this.getReginsterFormControls.passwordFirstInput.value)
      .subscribe(() => {
        this.sharedService.setGlobalEventData(this.successMessage[this.sharedService.language], 'success-window');
        this.router.navigate([this.homePath + 'login/']);
      },
      error => {
        this.error = error.statusText;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
