import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './app-header.component';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CorrectLinkHrefModule } from '../../derectives/correct-link-href/correct-link-href.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatFormFieldModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule,
		FormsModule,
		CorrectLinkHrefModule
	],
	declarations: [
		HeaderComponent,
	],
	exports: [
		HeaderComponent
	],
})
export class HeaderModule { }
