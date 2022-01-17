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
        path: 'reportsoperations',
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
      {
        path: 'view/:id',
        component: ReportOperationEditComponent
      },
      { path: '', redirectTo: 'reportsoperations', pathMatch: 'full' },
      { path: '**', redirectTo: 'reportsoperations', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportOperationRoutingModule {}
