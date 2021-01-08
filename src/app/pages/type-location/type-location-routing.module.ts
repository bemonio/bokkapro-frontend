import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeLocationComponent } from './type-location.component';
import { TypesLocationsComponent } from './types-locations/types-locations.component';
import { TypeLocationEditComponent } from './types-locations/type-location-edit/type-location-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeLocationComponent,
    children: [
      {
        path: 'list',
        component: TypesLocationsComponent,
      },
      {
        path: 'add',
        component: TypeLocationEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeLocationEditComponent
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
export class TypeLocationRoutingModule {}
