import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceFormComponent } from './invoice-form.component';
import { InvoiceFormsComponent } from './invoice-forms/invoice-forms.component';
import { InvoiceFormEditComponent } from './invoice-forms/invoice-form-edit/invoice-form-edit.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceFormComponent,
    children: [
      {
        path: 'list',
        component: InvoiceFormsComponent,
      },
      {
        path: 'add',
        component: InvoiceFormEditComponent
      },
      {
        path: 'edit/:id',
        component: InvoiceFormEditComponent,
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
      {
        path: 'view/:id',
        component: InvoiceFormEditComponent,
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
export class InvoiceFormRoutingModule {}
