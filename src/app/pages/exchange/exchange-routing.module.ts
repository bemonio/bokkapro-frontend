import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangeComponent } from './exchange.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
import { ExchangeEditComponent } from './exchanges/exchange-edit/exchange-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ExchangeComponent,
    children: [
      {
        path: 'list',
        component: ExchangesComponent,
      },
      {
        path: 'add',
        component: ExchangeEditComponent
      },
      {
        path: 'edit/:id',
        component: ExchangeEditComponent
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
export class ExchangeRoutingModule {}
