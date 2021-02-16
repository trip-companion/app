import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalPreloaderComponent } from './global-preloader.component';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  declarations: [
    GlobalPreloaderComponent,
  ],
  exports: [
    GlobalPreloaderComponent
  ],
})
export class GlobalPreloaderModule { }
