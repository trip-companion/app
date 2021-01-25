import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppServerModule {
}
