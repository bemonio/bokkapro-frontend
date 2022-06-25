import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeServiceOrderComponent } from './type-service-order.component';
import { TypesServiceOrdersComponent } from './types-service-orders/types-service-orders.component';
import { TypeServiceOrderEditComponent } from './types-service-orders/type-service-order-edit/type-service-order-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeServiceOrderComponent,
    children: [
      {
        path: 'list',
        component: TypesServiceOrdersComponent,
      },
      {
        path: 'add',
        component: TypeServiceOrderEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeServiceOrderEditComponent
      },
      {
        path: 'view/:id',
        component: TypeServiceOrderEditComponent
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
export class TypeServiceOrderRoutingModule {}
