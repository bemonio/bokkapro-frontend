import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent,
    children: [
      {
        path: 'list',
        component: InvoicesComponent,
      },
      {
        path: 'add',
        component: InvoiceEditComponent
      },
      {
        path: 'edit/:id',
        component: InvoiceEditComponent,
        children: [
          {
            path: 'invoices',
            loadChildren: () =>
              import('../deposit-formdetail/deposit-formdetail-routing.module').then(
                (m) => m.DepositFormDetailRoutingModule
              ),
          },
        ]
      },
      {
        path: 'view/:id',
        component: InvoiceEditComponent,
        children: [
          {
            path: 'depositformsdetails',
            loadChildren: () =>
              import('../deposit-formdetail/deposit-formdetail-routing.module').then(
                (m) => m.DepositFormDetailRoutingModule
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
export class InvoiceRoutingModule {}
