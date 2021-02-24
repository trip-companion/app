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
import { StoreModule } from '@ngrx/store';
import { UserEffects } from '@app/store/effects/user.effects';
import { userReducer } from '@app/store/reducers/user.reduser';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { UserYearsOldPipe } from '../../pipe/user-years-old';

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
    StoreModule.forFeature('userInfo', userReducer),
    EffectsModule.forFeature([UserEffects])
  ],
  providers: [],
  declarations: [
    AccountComponent,
    UserYearsOldPipe
  ],
  exports: [AccountComponent],
})
export class AccountModule { }
