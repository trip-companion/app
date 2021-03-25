import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountHeaderComponent } from './account-header.component';
// UI Material
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
  ],
  declarations: [
    AccountHeaderComponent,
  ],
  exports: [
    AccountHeaderComponent,
  ],
})
export class AccountHeaderModule { }
