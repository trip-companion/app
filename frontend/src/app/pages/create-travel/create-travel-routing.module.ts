import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTravelComponent } from './create-travel.component';

const routes: Routes = [
  { path: '', component: CreateTravelComponent },
  { path: '**', canLoad: [false] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTravelRoutingModule { }
