import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeCompanyComponent as ModelComponent } from './type-company.component';
import { TypesCompaniesComponent as ModelComponents } from './types-companies/types-companies.component';
import { TypeCompanyEditComponent as ModelEditComponent } from './types-companies/type-company-edit/type-company-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ModelComponent,
    children: [
      {
        path: 'list',
        component: ModelComponents,
      },
      {
        path: 'add',
        component: ModelEditComponent
      },
      {
        path: 'edit/:id',
        component: ModelEditComponent
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
