import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankAccountComponent } from './bank-account.component';
import { BanksAccountsComponent } from './banks-accounts/banks-accounts.component';
import { BankAccountEditComponent } from './banks-accounts/bank-account-edit/bank-account-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    children: [
      {
        path: 'list',
        component: BanksAccountsComponent,
      },
      {
        path: 'add',
        component: BankAccountEditComponent
      },
      {
        path: 'edit/:id',
        component: BankAccountEditComponent
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
export class BankAccountRoutingModule {}
