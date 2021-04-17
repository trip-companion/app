import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { PageResolver } from '@app/guards/page.resolver';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: 'trip-list', resolve: {pageResolved: PageResolver}, data: {subpage: `_LIST` }, component: AccountComponent},
  { path: 'trip-feedback', resolve: {pageResolved: PageResolver}, data: {subpage: `_FEEDBACK` }, component: AccountComponent},
  { path: '**', canLoad: [false] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
