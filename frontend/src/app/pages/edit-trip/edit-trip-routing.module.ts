import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTripComponent } from './edit-trip.component';
import { EditTripDetailResolver } from './edit-trip.detail.resolver';

const routes: Routes = [
  { path: '', resolve: {editTrip: EditTripDetailResolver}, component: EditTripComponent },
  { path: '**', canLoad: [false] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTripComponentRoutingModule { }
