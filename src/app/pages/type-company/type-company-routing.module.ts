import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeCompanyComponent } from './type-company.component';
import { TypesCompaniesComponent } from './types-companies/types-companies.component';
import { TypeCompanyEditComponent } from './types-companies/type-company-edit/type-company-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeCompanyComponent,
    children: [
      {
        path: 'list',
        component: TypesCompaniesComponent,
      },
      {
        path: 'add',
        component: TypeCompanyEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeCompanyEditComponent
      },
      {
        path: 'view/:id',
        component: TypeCompanyEditComponent
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
export class TypeCompanyRoutingModule {}
