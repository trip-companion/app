import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

// material
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MaterialModule } from '@app/modules/material.module';

import { EffectsModule } from '@ngrx/effects';
import { PageDataEffects } from '@app/store/effects/pageData.effects';

@NgModule({
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatMomentDateModule,
    EffectsModule.forFeature([PageDataEffects])
  ],
  providers: [],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
