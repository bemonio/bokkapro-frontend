import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeCurrencyComponent } from './type-currency.component';
import { TypesCurrenciesComponent } from './types-currencies/types-currencies.component';
import { TypeCurrencyEditComponent } from './types-currencies/type-currency-edit/type-currency-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeCurrencyComponent,
    children: [
      {
        path: 'list',
        component: TypesCurrenciesComponent,
      },
      {
        path: 'add',
        component: TypeCurrencyEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeCurrencyEditComponent
      },
      {
        path: 'view/:id',
        component: TypeCurrencyEditComponent
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
export class TypeCurrencyRoutingModule {}
