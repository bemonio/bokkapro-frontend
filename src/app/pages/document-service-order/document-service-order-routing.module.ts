import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentServiceOrderComponent } from './document-service-order.component';
import { DocumentsServicesOrdersComponent } from './documents-services-orders/documents-services-orders.component';
import { DocumentServiceOrderEditComponent } from './documents-services-orders/document-service-order-edit/document-service-order-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentServiceOrderComponent,
    children: [
      {
        path: 'list',
        component: DocumentsServicesOrdersComponent,
      },
      {
        path: 'add',
        component: DocumentServiceOrderEditComponent
      },
      {
        path: 'edit/:id',
        component: DocumentServiceOrderEditComponent
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
export class DocumentServiceOrderRoutingModule {}
