import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';

import { MaterialModule } from '@app/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserEffects } from '@app/store/effects/user.effects';
import { userReducer } from '@app/store/reducers/user.reduser';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule,
    MatAutocompleteModule,
    StoreModule.forFeature('userInfo', userReducer),
    EffectsModule.forFeature([UserEffects])
  ],
  declarations: [AccountComponent],
  exports: [AccountComponent],
  providers: [],
})
export class AccountModule { }
