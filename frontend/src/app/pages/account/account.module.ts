import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';

import { MaterialModule } from '@app/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '@app/store/effects/user.effects';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AccountUserDataEffects } from '@app/store/effects/accountUserAboutData.effects';
import { PageDataEffects } from '@app/store/effects/pageData.effects';

import { UserYearsOldPipe } from '@app/pipe/user-years-old';
import { UserLanguageLvlPipe } from '@app/pipe/language-lvl-ui';
import { UserLanguagesNameByIsoPipe } from '@app/pipe/language-displayname-ui';
import { UserInterestsNameByIdPipe } from '@app/pipe/interests-display-ui';
import { UserCheckFeaturesPipe } from '@app/pipe/account-check-features';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatChipsModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatListModule,
    MatRadioModule,
    MatToolbarModule,
    MatDatepickerModule,
    EffectsModule.forFeature([UserEffects, AccountUserDataEffects, PageDataEffects])
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
