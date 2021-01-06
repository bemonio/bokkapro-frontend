import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SegmentCompanyComponent } from './segment-company.component';
import { SegmentsCompaniesComponent } from './segments-companies/segments-companies.component';
import { SegmentCompanyEditComponent } from './segments-companies/segment-company-edit/segment-company-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SegmentCompanyComponent,
    children: [
      {
        path: 'list',
        component: SegmentsCompaniesComponent,
      },
      {
        path: 'add',
        component: SegmentCompanyEditComponent
      },
      {
        path: 'edit/:id',
        component: SegmentCompanyEditComponent
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
export class SegmentCompanyRoutingModule {}
