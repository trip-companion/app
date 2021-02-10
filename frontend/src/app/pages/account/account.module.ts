import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';

import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '@app/store/effects/user.effects';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    EffectsModule.forFeature([UserEffects])
  ],
  providers:[],
  declarations: [AccountComponent],
  exports: [AccountComponent]
})
export class AccountModule { }
