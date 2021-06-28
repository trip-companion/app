import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTripComponent } from './edit-trip.component';

import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/modules/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { uiSomeNameByIdModule } from '@app/modules/userSomeNameById.module';

import { EffectsModule } from '@ngrx/effects';
import { PageDataEffects } from '@app/store/effects/pageData.effects';
import { AccountTripListEffects } from '@app/store/effects/accountTripList.effects';
import { EditTripComponentRoutingModule } from './edit-trip-routing.module';
import { EditTripDetailResolver } from './edit-trip.detail.resolver';

@NgModule({
  imports: [
    CommonModule,
    EditTripComponentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MaterialModule,
    EffectsModule.forFeature([PageDataEffects, AccountTripListEffects]),
    MatMomentDateModule,
    uiSomeNameByIdModule
  ],
  declarations: [
    EditTripComponent,
  ],
  exports: [
    EditTripComponent,
  ],
  providers: [
    EditTripDetailResolver,
  ]
})
export class EditTripModule {}
