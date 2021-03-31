import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTravelRoutingModule } from './create-travel-routing.module';
import { CreateTravelComponent } from './create-travel.component';

import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/modules/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { EffectsModule } from '@ngrx/effects';
import { PageDataEffects } from '@app/store/effects/pageData.effects';

@NgModule({
  imports: [
    CommonModule,
    CreateTravelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MaterialModule,
    EffectsModule.forFeature([PageDataEffects]),
    MatMomentDateModule,
  ],
  providers: [],
  declarations: [CreateTravelComponent],
  exports: [CreateTravelComponent]
})
export class CreateTravelModule { }
