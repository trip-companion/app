import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './app-header.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
	],
	declarations: [
		HeaderComponent,
	],
	exports: [
		HeaderComponent
	],
})
export class HeaderModule { }
