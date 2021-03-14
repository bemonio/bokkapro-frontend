import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositFormComponent } from './deposit-form.component';
import { DepositFormsComponent } from './deposit-forms/deposit-forms.component';
import { DepositFormEditComponent } from './deposit-forms/deposit-form-edit/deposit-form-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DepositFormComponent,
    children: [
      {
        path: 'list',
        component: DepositFormsComponent,
      },
      {
        path: 'add',
        component: DepositFormEditComponent
      },
      {
        path: 'edit/:id',
        component: DepositFormEditComponent
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
export class DepositFormRoutingModule {}
