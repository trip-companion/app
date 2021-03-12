import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTravelRoutingModule } from './create-travel-routing.module';
import { CreateTravelComponent } from './create-travel.component';

import { ReactiveFormsModule , FormsModule } from '@angular/forms';


import { MaterialModule } from '@app/modules/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    CommonModule,
    CreateTravelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MaterialModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  providers: [],
  declarations: [CreateTravelComponent],
  exports: [CreateTravelComponent]
})
export class CreateTravelModule { }
