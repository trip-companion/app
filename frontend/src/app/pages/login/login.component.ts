import {Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service'
import { LocationService } from '../../services/location.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation : ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent implements OnInit {
    public loading = false;
    public submitted = false;
    public returnUrl: string;
	public error = '';
	
	public loginForm = new FormGroup({
		loginInput: new FormControl('', Validators.required),
		passwordInput: new FormControl('', Validators.required),
	})

    constructor(
		public cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        public locationService: LocationService,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.tokenValue) { 
            this.router.navigate(['/']);
        }
    }

    public ngOnInit() {
        // get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    public onSubmitLogin(event: Event) {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
		this.loading = true;
        this.authenticationService.login(this.f.loginInput.value, this.f.passwordInput.value)
            // .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error.statusText;
					this.loading = false;
				});
				
    }
}