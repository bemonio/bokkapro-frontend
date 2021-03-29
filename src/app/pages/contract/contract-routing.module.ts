import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractComponent } from './contract.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractEditComponent } from './contracts/contract-edit/contract-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ContractComponent,
    children: [
      {
        path: 'list',
        component: ContractsComponent,
      },
      {
        path: 'add',
        component: ContractEditComponent
      },
      {
        path: 'edit/:id',
        component: ContractEditComponent
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
export class ContractRoutingModule {}
