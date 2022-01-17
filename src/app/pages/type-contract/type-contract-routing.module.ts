import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeContractComponent } from './type-contract.component';
import { TypesContractsComponent } from './types-contracts/types-contracts.component';
import { TypeContractEditComponent } from './types-contracts/type-contract-edit/type-contract-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeContractComponent,
    children: [
      {
        path: 'list',
        component: TypesContractsComponent,
      },
      {
        path: 'add',
        component: TypeContractEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeContractEditComponent
      },
      {
        path: 'view/:id',
        component: TypeContractEditComponent
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
export class TypeContractRoutingModule {}
