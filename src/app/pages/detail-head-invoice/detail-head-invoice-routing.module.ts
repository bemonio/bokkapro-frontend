import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailHeadInvoiceComponent } from './detail-head-invoice.component';
import { DetailHeadInvoicesComponent } from './detail-head-invoices/detail-head-invoices.component';
import { DetailHeadInvoiceEditComponent } from './detail-head-invoices/detail-head-invoice-edit/detail-head-invoice-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DetailHeadInvoiceComponent,
    children: [
      {
        path: 'list',
        component: DetailHeadInvoicesComponent,
      },
      {
        path: 'add',
        component: DetailHeadInvoiceEditComponent
      },
      {
        path: 'edit/:id',
        component: DetailHeadInvoiceEditComponent
      },
      {
        path: 'view/:id',
        component: DetailHeadInvoiceEditComponent
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
export class HeadInvoiceRoutingModule {}
