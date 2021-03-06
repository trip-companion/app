import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// resolvers
import { LanguageResolver } from './guards/language.resolver';
import { PageResolver } from '@app/guards/page.resolver';
import { PageDataResolver } from '@app/guards/pageData.resolver';
// guards
import { AuthGuard } from '@app/guards/auth.guards';
// Components
import { Redirect301Component } from './components/redirect301/redirect301.component';

const PAGES_ROUTES: Routes = [
  { path: 'faq',
    resolve: {pageResolved: PageResolver}, data: { page: `FAQ`},
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule)
  },
  { path: 'account',
    canActivate: [AuthGuard], resolve: {pageResolved: PageResolver, pageContent: PageDataResolver},
    data: {page: `USER_ACCOUNT`},
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  { path: 'login',
    resolve: {pageResolved: PageResolver}, data: { page: `LOG_IN`},
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  { path: 'sign-up',
    resolve: {pageResolved: PageResolver}, data: { page: `SING_UP`},
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
  },
  { path: 'create-travel',
    resolve: {pageResolved: PageResolver, pageContent: PageDataResolver}, data: {page: `CREATE_TRIP`},
    loadChildren: () => import('./pages/create-travel/create-travel.module').then(m => m.CreateTravelModule)
  },
  { path: '',
    resolve: {pageResolved: PageResolver, pageContent: PageDataResolver},
    data: {page: `WELCOME`},
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)
  },
  { path: '**', component: Redirect301Component },
];

export const ROUTES: Routes = [
  { path: 'ua', resolve: {langResolved: LanguageResolver}, data: {lang: 'ua'}, children: PAGES_ROUTES},
  { path: 'ru', resolve: {langResolved: LanguageResolver}, data: {lang: 'ru'}, children: PAGES_ROUTES},
  { path: '', resolve: {langResolved: LanguageResolver}, data: {lang: 'en'}, children: PAGES_ROUTES},
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { useHash: false, initialNavigation: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
