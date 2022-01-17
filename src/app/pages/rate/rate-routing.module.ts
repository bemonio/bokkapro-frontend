import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RateComponent } from './rate.component';
import { RatesComponent } from './rates/rates.component';
import { RateEditComponent } from './rates/rate-edit/rate-edit.component';

const routes: Routes = [
  {
    path: '',
    component: RateComponent,
    children: [
      {
        path: 'list',
        component: RatesComponent,
      },
      {
        path: 'add',
        component: RateEditComponent
      },
      {
        path: 'edit/:id',
        component: RateEditComponent
      },
      {
        path: 'view/:id',
        component: RateEditComponent
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
export class RateRoutingModule {}
