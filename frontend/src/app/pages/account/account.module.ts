import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';

import { MaterialModule } from '@app/modules/material.module';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '@app/store/effects/user.effects';
import { AccountUserDataEffects } from '@app/store/effects/accountUserAboutData.effects';
import { PageDataEffects } from '@app/store/effects/pageData.effects';
import { UserYearsOldPipe } from '@app/pipe/user-years-old';
import { UserLanguageLvlPipe } from '@app/pipe/language-lvl-ui';
import { UserLanguagesNameByIsoPipe } from '@app/pipe/language-displayname-ui';
import { UserInterestsNameByIdPipe } from '@app/pipe/interests-display-ui';
import { UserCheckFeaturesPipe } from '@app/pipe/account-check-features';
//child component
import { AccountHeaderModule } from './account-header/account-header.module';
import { AccountTripListModule } from './account-trip-list/account-trip-list.module';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatListModule,
    MatRadioModule,
    MatToolbarModule,
    EffectsModule.forFeature([UserEffects, AccountUserDataEffects, PageDataEffects]),
    AccountHeaderModule,
    AccountTripListModule,
  ],
  providers: [],
  declarations: [
    AccountComponent,
    UserYearsOldPipe,
    UserLanguageLvlPipe,
    UserLanguagesNameByIsoPipe,
    UserInterestsNameByIdPipe,
    UserCheckFeaturesPipe
  ],
  exports: [AccountComponent],
})
export class AccountModule { }
