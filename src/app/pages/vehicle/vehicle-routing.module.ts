import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleComponent } from './vehicle.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleEditComponent } from './vehicles/vehicle-edit/vehicle-edit.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleComponent,
    children: [
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'add',
        component: VehicleEditComponent
      },
      {
        path: 'edit/:id',
        component: VehicleEditComponent
      },
      {
        path: 'view/:id',
        component: VehicleEditComponent
      },
      { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
      { path: '**', redirectTo: 'vehicles', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRoutingModule {}
