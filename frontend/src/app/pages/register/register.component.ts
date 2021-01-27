import {Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service'
import { LocationService } from '../../services/location.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	encapsulation : ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.Default,
})
export class RegisterComponent implements OnInit {
    public loading = false;
    public submitted = false;
    public returnUrl: string;
	public error = '';
    public registerForm: FormGroup;
    
    constructor(private fb: FormBuilder,
		public cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public locationService: LocationService,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        this.registerForm = this.fb.group({
            loginInput: new FormControl('', Validators.required),
            firstNameInput: new FormControl('', Validators.required),
            lastNameInput: new FormControl('', Validators.required),
            emailInput: new FormControl('', Validators.compose([Validators.email, Validators.required])), 
            passwordFirstInput: new FormControl('', Validators.required),
            passwordSecondInput: new FormControl('', Validators.required),
        }, { validators: this.checkPasswords })
        // redirect to home if already logged in
        if (this.authenticationService.tokenValue) { 
            this.router.navigate(['/']);
        }
    }

    public ngOnInit() {
        // get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    public checkPasswords(registerForm: FormGroup) { // here we have the 'passwords' group
        const password = registerForm.get('passwordFirstInput').value;
        const confirmPassword = registerForm.get('passwordSecondInput').value;

        return password === confirmPassword ? null : { notSamePassword: true }
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    public onSubmitRegister(event: Event) {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
		this.loading = true;
        // this.authenticationService.login(this.f.loginInput.value, this.f.passwordInput.value)
        //     // .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.error = error.statusText;
		// 			this.loading = false;
		// 		});
				
    }
}