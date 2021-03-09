import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrencyDetailComponent } from './currency-detail.component';
import { CurrenciesDetailsComponent } from './currencies-details/currencies-details.component';
import { CurrencyDetailEditComponent } from './currencies-details/currency-detail-edit/currency-detail-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyDetailComponent,
    children: [
      {
        path: 'list',
        component: CurrenciesDetailsComponent,
      },
      {
        path: 'add',
        component: CurrencyDetailEditComponent
      },
      {
        path: 'edit/:id',
        component: CurrencyDetailEditComponent
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
export class CurrencyDetailRoutingModule {}
