import {Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '@app/services/authentication.service';
import { LocationService } from '@app/services/location.service';

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
	public homePath =  this.locationService.extractBasePATH();
	
	public loginForm = new FormGroup({
		loginInput: new FormControl('testUser@gmail.com',  Validators.compose([Validators.email, Validators.required])),
		passwordInput: new FormControl('12345678', Validators.required),
	})

	constructor(
		public cdr: ChangeDetectorRef,
		public locationService: LocationService,
		private router: Router,
		private route: ActivatedRoute,
		private authenticationService: AuthenticationService
	) { 
		if (this.authenticationService.tokenValue) { 
			this.router.navigate([this.homePath]);
		}
	}

	public ngOnInit() {
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.homePath;
	}

	get f() { return this.loginForm.controls; }

	public onSubmitLogin(event: Event) {
		this.submitted = true;
		if (this.loginForm.invalid) return;
		this.loading = true;
		this.authenticationService.login(this.f.loginInput.value, this.f.passwordInput.value)
			.subscribe(() => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.error = error.statusText;
					this.loading = false;
					this.cdr.detectChanges();
				});
	}

}