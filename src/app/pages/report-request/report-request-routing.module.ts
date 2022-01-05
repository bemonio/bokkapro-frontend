import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportRequestComponent } from './report-request.component';
import { ReportRequestsComponent } from './report-requests/report-requests.component';

const routes: Routes = [
  {
    path: '',
    component: ReportRequestComponent,
    children: [
      {
        path: 'reportsrequests',
        component: ReportRequestsComponent,
      },
      { path: '', redirectTo: 'reportsrequests', pathMatch: 'full' },
      { path: '**', redirectTo: 'reportsrequests', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRequestRoutingModule {}
