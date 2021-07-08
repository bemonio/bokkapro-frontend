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
          {
            path: 'companycontacts',
            loadChildren: () =>
              import('../../pages/company-contact/company-contact-routing.module').then(
                (m) => m.CompanyContactRoutingModule
              ),
          },
          {
            path: 'quotations',
            loadChildren: () =>
              import('../../pages/quotation/quotation-routing.module').then(
                (m) => m.QuotationRoutingModule
              ),
          },
          {
            path: 'locations',
            loadChildren: () =>
              import('../../pages/location/location-routing.module').then(
                (m) => m.LocationRoutingModule
              ),
          },
          {
            path: 'serviceorders',
            loadChildren: () =>
              import('../../pages/service-order/service-order-routing.module').then(
                (m) => m.ServiceOrderRoutingModule
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
