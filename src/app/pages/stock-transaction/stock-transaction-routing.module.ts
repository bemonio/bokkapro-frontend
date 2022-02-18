import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTransactionComponent } from './stock-transaction.component';
import { StockTransactionsComponent } from './stock-transactions/stock-transactions.component';
import { StockTransactionEditComponent } from './stock-transactions/stock-transaction-edit/stock-transaction-edit.component';

const routes: Routes = [
  {
    path: '',
    component: StockTransactionComponent,
    children: [
      {
        path: 'list',
        component: StockTransactionsComponent,
      },
      {
        path: 'add',
        component: StockTransactionEditComponent
      },
      {
        path: 'edit/:id',
        component: StockTransactionEditComponent
      },
      {
        path: 'view/:id',
        component: StockTransactionEditComponent
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
export class StockTransactionRoutingModule {}
