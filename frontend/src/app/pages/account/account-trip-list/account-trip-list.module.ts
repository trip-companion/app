import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountTripListComponent } from './account-trip-list.component';

import { AccountTripCardModule } from './account-trip-card/account-trip-card.module';
import { TripListResolver } from './trip-list.resolver';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AccountTripCardModule,
  ],
  declarations: [
    AccountTripListComponent,
  ],
  exports: [
    AccountTripListComponent,
  ],
  providers:  [
    TripListResolver
  ]
})
export class AccountTripListModule { }
