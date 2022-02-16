import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeProductTransactionComponent } from './type-product-transaction.component';
import { TypesProductTransactionsComponent } from './types-product-transactions/types-product-transactions.component';
import { TypeProductTransactionEditComponent } from './types-product-transactions/type-product-transaction-edit/type-product-transaction-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeProductTransactionComponent,
    children: [
      {
        path: 'list',
        component: TypesProductTransactionsComponent,
      },
      {
        path: 'add',
        component: TypeProductTransactionEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeProductTransactionEditComponent
      },
      {
        path: 'view/:id',
        component: TypeProductTransactionEditComponent
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
export class TypeProductTransactionRoutingModule {}
