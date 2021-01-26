import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Components
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/' },
  { path: 'login', data: {page: `login/`}, loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: '', data: {page: `/`},  loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: '**', redirectTo: '/' },
];

// export const ROUTES: Routes = [
// 	{ path: 'en',         resolve: {langResolved: LanguageResolver}, data: {lang: 'en'}, children: PAGES_ROUTES},
// 	{ path: 'ru',         resolve: {langResolved: LanguageResolver}, data: {lang: 'ru'}, children: PAGES_ROUTES},
// 	{ path: '',           resolve: {langResolved: LanguageResolver}, data: {lang: 'uk'}, children: PAGES_ROUTES}
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
