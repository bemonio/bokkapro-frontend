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
          import('../pages/user/user.module').then(
            (m) => m.UserModule
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
