import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'errors/404',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../pages/user/user-routing.module').then(
            (m) => m.UserRoutingModule
          ),
      },
      {
        path: 'segmentscompanies',
        loadChildren: () =>
          import('../pages/segment-company/segment-company-routing.module').then(
            (m) => m.SegmentCompanyRoutingModule
          ),
      },
      {
        path: 'typescompanies',
        loadChildren: () =>
          import('../pages/type-company/type-company-routing.module').then(
            (m) => m.TypeCompanyRoutingModule
          ),
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('../pages/company/company-routing.module').then(
            (m) => m.CompanyRoutingModule
          ),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('../pages/department/department-routing.module').then(
            (m) => m.DepartmentRoutingModule
          ),
      },
      {
        path: 'typesdivisions',
        loadChildren: () =>
          import('../pages/type-division/type-division-routing.module').then(
            (m) => m.TypeDivisionRoutingModule
          ),
      },
      {
        path: 'divisions',
        loadChildren: () =>
          import('../pages/division/division-routing.module').then(
            (m) => m.DivisionRoutingModule
          ),
      },
      {
        path: 'offices',
        loadChildren: () =>
          import('../pages/office/office-routing.module').then(
            (m) => m.OfficeRoutingModule
          ),
      },
      {
        path: 'positions',
        loadChildren: () =>
          import('../pages/position/position-routing.module').then(
            (m) => m.PositionRoutingModule
          ),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('../pages/employee/employee-routing.module').then(
            (m) => m.EmployeeRoutingModule
          ),
      },
      {
        path: 'typeslocations',
        loadChildren: () =>
          import('../pages/type-location/type-location-routing.module').then(
            (m) => m.TypeLocationRoutingModule
          ),
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('../pages/location/location-routing.module').then(
            (m) => m.LocationRoutingModule
          ),
      },
      {
        path: 'zones',
        loadChildren: () =>
          import('../pages/zone/zone-routing.module').then(
            (m) => m.ZoneRoutingModule
          ),
      },
      {
        path: 'typesguides',
        loadChildren: () =>
          import('../pages/type-guide/type-guide-routing.module').then(
            (m) => m.TypeGuideRoutingModule
          ),
      },
      {
        path: 'guides',
        loadChildren: () =>
          import('../pages/guide/guide-routing.module').then(
            (m) => m.GuideRoutingModule
          ),  
      },
      {
        path: 'guidesinput',
        loadChildren: () =>
          import('../pages/guide/guide-routing.module').then(
            (m) => m.GuideRoutingModule
          ),  
      },
      {
        path: 'guidesoutput',
        loadChildren: () =>
          import('../pages/guide/guide-routing.module').then(
            (m) => m.GuideRoutingModule
          ),  
      },
      {
        path: 'guidescheck',
        loadChildren: () =>
          import('../pages/guide/guide-routing.module').then(
            (m) => m.GuideRoutingModule
          ),  
      },
      {
        path: 'packings',
        loadChildren: () =>
          import('../pages/packing/packing-routing.module').then(
            (m) => m.PackingRoutingModule
          ),
      },
      {
        path: 'depositforms',
        loadChildren: () =>
          import('../pages/deposit-form/deposit-form-routing.module').then(
            (m) => m.DepositFormRoutingModule
          ),
      },
      {
        path: 'depositformsdetails',
        loadChildren: () =>
          import('../pages/deposit-formdetail/deposit-formdetail-routing.module').then(
            (m) => m.DepositFormDetailRoutingModule
          ),
      },
      {
        path: 'vouchers',
        loadChildren: () =>
          import('../pages/voucher/voucher-routing.module').then(
            (m) => m.VoucherRoutingModule
          ),
      },
      {
        path: 'currencies',
        loadChildren: () =>
          import('../pages/currency/currency-routing.module').then(
            (m) => m.CurrencyRoutingModule
          ),
      },
      {
        path: 'typescurrencies',
        loadChildren: () =>
          import('../pages/type-currency/type-currency-routing.module').then(
            (m) => m.TypeCurrencyRoutingModule
          ),
      },
      {
        path: 'currenciesdetails',
        loadChildren: () =>
          import('../pages/currency-detail/currency-detail-routing.module').then(
            (m) => m.CurrencyDetailRoutingModule
          ),
      },
      {
        path: 'exchanges',
        loadChildren: () =>
          import('../pages/exchange/exchange-routing.module').then(
            (m) => m.ExchangeRoutingModule
          ),
      },
      {
        path: 'banksaccounts',
        loadChildren: () =>
          import('../pages/bank-account/bank-account-routing.module').then(
            (m) => m.BankAccountRoutingModule
          ),
      },
      {
        path: 'contracts',
        loadChildren: () =>
          import('../pages/contract/contract-routing.module').then(
            (m) => m.ContractRoutingModule
          ),
      },
      {
        path: 'typescontracts',
        loadChildren: () =>
          import('../pages/type-contract/type-contract-routing.module').then(
            (m) => m.TypeContractRoutingModule
          ),
      },
      {
        path: 'companycontacts',
        loadChildren: () =>
          import('../pages/company-contact/company-contact-routing.module').then(
            (m) => m.CompanyContactRoutingModule
          ),
      },
      {
        path: 'moderations',
        loadChildren: () =>
          import('../pages/moderation/moderation-routing.module').then(
            (m) => m.ModerationRoutingModule
          ),
      },
      {
        path: 'quotetemplates',
        loadChildren: () =>
          import('../pages/quote-template/quote-template-routing.module').then(
            (m) => m.QuoteTemplateRoutingModule
          ),
      },
      {
        path: 'quotations',
        loadChildren: () =>
          import('../pages/quotation/quotation-routing.module').then(
            (m) => m.QuotationRoutingModule
          ),
      },
      {
        path: 'clauses',
        loadChildren: () =>
          import('../pages/clause/clause-routing.module').then(
            (m) => m.ClauseRoutingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
