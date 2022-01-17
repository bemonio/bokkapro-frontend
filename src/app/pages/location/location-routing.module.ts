import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationComponent } from './location.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationEditComponent } from './locations/location-edit/location-edit.component';

const routes: Routes = [
  {
    path: '',
    component: LocationComponent,
    children: [
      {
        path: 'list',
        component: LocationsComponent,
      },
      {
        path: 'add',
        component: LocationEditComponent
      },
      {
        path: 'edit/:id',
        component: LocationEditComponent
      },
      {
        path: 'view/:id',
        component: LocationEditComponent
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationRoutingModule {}
