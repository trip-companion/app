import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './app-header.component';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CorrectLinkHrefModule } from '@app/derectives/correct-link-href/correct-link-href.module';
import { MaterialModule } from '@app/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
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
