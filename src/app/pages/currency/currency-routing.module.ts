import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrencyComponent } from './currency.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { CurrencyEditComponent } from './currencies/currency-edit/currency-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyComponent,
    children: [
      {
        path: 'list',
        component: CurrenciesComponent,
      },
      {
        path: 'add',
        component: CurrencyEditComponent
      },
      {
        path: 'edit/:id',
        component: CurrencyEditComponent
      },
      {
        path: 'view/:id',
        component: CurrencyEditComponent
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
export class CurrencyRoutingModule {}
