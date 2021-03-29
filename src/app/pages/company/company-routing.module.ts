import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyComponent } from './company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyEditComponent } from './companies/company-edit/company-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      {
        path: 'list',
        component: CompaniesComponent,
      },
      {
        path: 'add',
        component: CompanyEditComponent
      },
      {
        path: 'edit/:id',
        component: CompanyEditComponent,
        children: [
          {
            path: 'contracts',
            loadChildren: () =>
              import('../../pages/contract/contract-routing.module').then(
                (m) => m.ContractRoutingModule
              ),
          },
        ]

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
export class CompanyRoutingModule {}
