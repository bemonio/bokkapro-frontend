import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailInvoiceComponent } from './detail-invoice.component';
import { DetailInvoicesComponent } from './detail-invoices/detail-invoices.component';
import { DetailInvoiceEditComponent } from './detail-invoices/detail-invoice-edit/detail-invoice-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DetailInvoiceComponent,
    children: [
      {
        path: 'list',
        component: DetailInvoicesComponent,
      },
      {
        path: 'add',
        component: DetailInvoiceEditComponent
      },
      {
        path: 'edit/:id',
        component: DetailInvoiceEditComponent
      },
      {
        path: 'view/:id',
        component: DetailInvoiceEditComponent
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
export class DetailInvoiceRoutingModule {}
