import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountTripCardComponent } from './account-trip-card.component';
// UI Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CorrectLinkHrefModule } from '@app/derectives/correct-link-href/correct-link-href.module';
import { TripCardSizingDescriptionPipe } from '@app/pipe/trip-card-sizing-description';
import { uiSomeNameByIdModule } from '@app/modules/userSomeNameById.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CorrectLinkHrefModule,
    uiSomeNameByIdModule,
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
