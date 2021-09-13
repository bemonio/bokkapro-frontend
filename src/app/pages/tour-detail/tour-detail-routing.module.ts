import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourDetailComponent } from './tour-detail.component';
import { ToursDetailsComponent } from './tours-details/tours-details.component';
import { TourDetailEditComponent } from './tours-details/tour-detail-edit/tour-detail-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TourDetailComponent,
    children: [
      {
        path: 'list',
        component: ToursDetailsComponent,
      },
      {
        path: 'add',
        component: TourDetailEditComponent
      },
      {
        path: 'edit/:id',
        component: TourDetailEditComponent
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
export class TourDetailRoutingModule {}
