import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockSerialComponent } from './stock-serial.component';
import { StockSerialsComponent } from './stock-serials/stock-serials.component';
import { StockSerialEditComponent } from './stock-serials/stock-serial-edit/stock-serial-edit.component';

const routes: Routes = [
  {
    path: '',
    component: StockSerialComponent,
    children: [
      {
        path: 'list',
        component: StockSerialsComponent,
      },
      {
        path: 'add',
        component: StockSerialEditComponent
      },
      {
        path: 'edit/:id',
        component: StockSerialEditComponent
      },
      {
        path: 'view/:id',
        component: StockSerialEditComponent
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
export class StockSerialRoutingModule {}
