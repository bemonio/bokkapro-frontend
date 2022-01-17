import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OriginDestinationComponent } from './origin-destination.component';
import { OriginDestinationsComponent } from './origin-destinations/origin-destinations.component';
import { OriginDestinationEditComponent } from './origin-destinations/origin-destination-edit/origin-destination-edit.component';

const routes: Routes = [
  {
    path: '',
    component: OriginDestinationComponent,
    children: [
      {
        path: 'list',
        component: OriginDestinationsComponent,
      },
      {
        path: 'add',
        component: OriginDestinationEditComponent
      },
      {
        path: 'edit/:id',
        component: OriginDestinationEditComponent
      },
      {
        path: 'view/:id',
        component: OriginDestinationEditComponent
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
export class OriginDestinationRoutingModule {}
