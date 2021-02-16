import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalEventComponent } from './global-event.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
  ],
  declarations: [
    GlobalEventComponent,
  ],
  exports: [
    GlobalEventComponent
  ],
})
export class GlobalEventModule { }
