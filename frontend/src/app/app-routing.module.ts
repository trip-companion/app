import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//resolvers
import { LanguageResolver } from './guards/language.resolver';
import { PageResolver } from './guards/page.resolver';

// Components
import { Redirect301Component } from './components/redirect301/redirect301.component';

const PAGES_ROUTES: Routes = [
  { path: 'login',   resolve: {pageResolved: PageResolver}, data: {page: `login/`},   loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'sign-up', resolve: {pageResolved: PageResolver}, data: {page: `sign-up/`}, loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: '',        resolve: {pageResolved: PageResolver},  data: {page: `/`},       loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: '**',           component: Redirect301Component},
];

export const ROUTES: Routes = [
  { path: 'ua',       resolve: {langResolved: LanguageResolver}, data: {lang: 'ua'}, children: PAGES_ROUTES},
	{ path: 'ru',       resolve: {langResolved: LanguageResolver}, data: {lang: 'ru'}, children: PAGES_ROUTES},
  { path: '',         resolve: {langResolved: LanguageResolver}, data: {lang: 'en'}, children: PAGES_ROUTES},
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { useHash: false, initialNavigation: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
