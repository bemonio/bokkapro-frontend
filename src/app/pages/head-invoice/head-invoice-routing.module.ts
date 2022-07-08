import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeadInvoiceComponent } from './head-invoice.component';
import { HeadInvoicesComponent } from './head-invoices/head-invoices.component';
import { HeadInvoiceEditComponent } from './head-invoices/head-invoice-edit/head-invoice-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HeadInvoiceComponent,
    children: [
      {
        path: 'list',
        component: HeadInvoicesComponent,
      },
      {
        path: 'add',
        component: HeadInvoiceEditComponent
      },
      {
        path: 'edit/:id',
        component: HeadInvoiceEditComponent
      },
      {
        path: 'view/:id',
        component: HeadInvoiceEditComponent
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
