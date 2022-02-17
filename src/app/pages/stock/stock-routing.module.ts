import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockComponent } from './stock.component';
import { StocksComponent } from './stocks/stocks.component';
import { StockEditComponent } from './stocks/stock-edit/stock-edit.component';

const routes: Routes = [
  {
    path: '',
    component: StockComponent,
    children: [
      {
        path: 'list',
        component: StocksComponent,
      },
      {
        path: 'add',
        component: StockEditComponent
      },
      {
        path: 'edit/:id',
        component: StockEditComponent
      },
      {
        path: 'view/:id',
        component: StockEditComponent
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
export class StockRoutingModule {}
