import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTransactionDetailComponent } from './stock-transaction-detail.component';
import { StockTransactionDetailsComponent } from './stock-transaction-details/stock-transaction-details.component';
import { StockTransactionDetailEditComponent } from './stock-transaction-details/stock-transaction-detail-edit/stock-transaction-detail-edit.component';

const routes: Routes = [
  {
    path: '',
    component: StockTransactionDetailComponent,
    children: [
      {
        path: 'list',
        component: StockTransactionDetailsComponent,
      },
      {
        path: 'add',
        component: StockTransactionDetailEditComponent
      },
      {
        path: 'edit/:id',
        component: StockTransactionDetailEditComponent
      },
      {
        path: 'view/:id',
        component: StockTransactionDetailEditComponent
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
export class StockTransactionDetailRoutingModule {}
