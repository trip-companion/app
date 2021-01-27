import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';

import { HeaderModule } from './components/app-header/app-header.module';
//services
import { SharedService } from './services/shared.service';
import { LocationService } from './services/location.service';
import { SsrRedirectService } from './services/SsrRedirect.service';
import { LanguageResolver } from './guards/language.resolver';
import { StateService } from './services/state.service';
import { PageResolver } from './guards/page.resolver';
import { ResolverService } from './services/resolver.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    // UI Modules
    HeaderModule,
  ],
  providers: [
    SharedService,
    StateService,
    LanguageResolver,
    LocationService,
    SsrRedirectService,
    PageResolver,
		ResolverService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
