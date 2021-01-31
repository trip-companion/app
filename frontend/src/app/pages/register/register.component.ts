import {Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { SharedService } from '@app/services/shared.service';
import { LocationService } from '@app/services/location.service';

import { FORM_VALIDATORS } from '@app/DATA/errors-message';

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
    public inputErrors: Array<string>;
    public homePath =  this.locationService.extractBasePATH();
    
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
				// loginInput: new FormControl('', Validators.required),
				emailInput: new FormControl('123@ukr.net', Validators.compose([Validators.email, Validators.required])),
				firstNameInput: new FormControl('Lalala', Validators.required),
				lastNameInput: new FormControl('GGGG333', Validators.required),
				passwordFirstInput: new FormControl('1235', Validators.compose([Validators.required])),
				passwordSecondInput: new FormControl('1235', Validators.compose([Validators.required])),
			}, {validators: this.checkPasswords})
			if (this.authenticationService.tokenValue) { 
				this.router.navigate([this.homePath]);
			}
    }

    public ngOnInit() {
			this.activeRoute.data.subscribe(data => {
				this.inputErrors = FORM_VALIDATORS.find(obj => {
					return data.page === obj.url;
				})[data.lang];
			});
		this.returnUrl = this.sharedService.globalPrevRout || this.homePath;
    }

    public checkPasswords(registerForm: FormGroup) { // here we have the 'passwords' group
        const firstpassword = registerForm.get('passwordFirstInput').value;
        const confirmPassword = registerForm.get('passwordSecondInput').value;
        return firstpassword === confirmPassword ? null : { notSamePassword: true }
    }

    get f() { return this.registerForm.controls; }

	public onSubmitRegister(event: Event) {
		this.submitted = true;
		if (this.registerForm.invalid) return;
		this.loading = true;
		this.authenticationService.singUp(this.f.emailInput.value, this.f.firstNameInput.value,this.f.lastNameInput.value, this.f.passwordFirstInput.value)
			.subscribe(() => {
					this.router.navigate([this.homePath + 'login/']);
				},
				error => {
					this.error = error.statusText;
			this.loading = false;
			this.cdr.detectChanges();
		});		
	}
}