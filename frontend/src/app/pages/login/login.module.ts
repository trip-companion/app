
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

import { MaterialModule } from '@app/modules/material.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
	imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [LoginComponent],
	declarations: [LoginComponent],
	providers: []
})
export class LoginModule {}