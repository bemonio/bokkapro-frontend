import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackingComponent } from './packing.component';
import { PackingsComponent } from './packings/packings.component';
import { PackingEditComponent } from './packings/packing-edit/packing-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PackingComponent,
    children: [
      {
        path: 'list',
        component: PackingsComponent,
      },
      {
        path: 'add',
        component: PackingEditComponent
      },
      {
        path: 'edit/:id',
        component: PackingEditComponent,
        children: [
          {
            path: 'depositforms',
            loadChildren: () =>
              import('../../pages/deposit-form/deposit-form-routing.module').then(
                (m) => m.DepositFormRoutingModule
              ),
          },
        ]
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
export class PackingRoutingModule {}
