import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountTripCardComponent } from './account-trip-card.component';
// UI Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TripCardSizingDescriptionPipe } from '@app/pipe/trip-card-sizing-description';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  declarations: [
    AccountTripCardComponent,
    TripCardSizingDescriptionPipe,
  ],
  exports: [
    AccountTripCardComponent,
  ],
})
export class AccountTripCardModule { }
