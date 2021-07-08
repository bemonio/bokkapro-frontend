import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceOrderComponent } from './service-order.component';
import { ServiceOrdersComponent } from './service-orders/service-orders.component';
import { ServiceOrderEditComponent } from './service-orders/service-order-edit/service-order-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrderComponent,
    children: [
      {
        path: 'list',
        component: ServiceOrdersComponent,
      },
      {
        path: 'add',
        component: ServiceOrderEditComponent
      },
      {
        path: 'edit/:id',
        component: ServiceOrderEditComponent
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
export class ServiceOrderRoutingModule {}
