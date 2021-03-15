import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositFormDetailComponent } from './deposit-formdetail.component';
import { DepositFormsDetailsComponent } from './deposit-formsdetails/deposit-formsdetails.component';
import { DepositFormDetailEditComponent } from './deposit-formsdetails/deposit-formdetail-edit/deposit-formdetail-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DepositFormDetailComponent,
    children: [
      {
        path: 'list',
        component: DepositFormsDetailsComponent,
      },
      {
        path: 'add',
        component: DepositFormDetailEditComponent
      },
      {
        path: 'edit/:id',
        component: DepositFormDetailEditComponent
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
export class DepositFormDetailRoutingModule {}
