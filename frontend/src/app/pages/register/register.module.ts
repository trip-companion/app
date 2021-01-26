
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';

import { MaterialModule } from '@app/modules/material.module';

import { RegisterRoutingModule } from './register-routing.module';

@NgModule({
	imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [RegisterComponent],
	declarations: [RegisterComponent],
	providers: []
})
export class RegisterModule {}