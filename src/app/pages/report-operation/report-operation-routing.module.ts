import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportOperationComponent } from './report-operation.component';
import { ReportOperationsComponent } from './report-operations/report-operations.component';
import { ReportOperationEditComponent } from './report-operations/report-operation-edit/report-operation-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ReportOperationComponent,
    children: [
      {
        path: 'reports/operations',
        component: ReportOperationsComponent,
      },
      {
        path: 'add',
        component: ReportOperationEditComponent
      },
      {
        path: 'edit/:id',
        component: ReportOperationEditComponent
      },
      { path: '', redirectTo: 'reports/operations', pathMatch: 'full' },
      { path: '**', redirectTo: 'reports/operations', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportOperationRoutingModule {}
