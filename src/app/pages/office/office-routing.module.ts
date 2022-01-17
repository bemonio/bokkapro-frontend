import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficeComponent } from './office.component';
import { OfficesComponent } from './offices/offices.component';
import { OfficeEditComponent } from './offices/office-edit/office-edit.component';

const routes: Routes = [
  {
    path: '',
    component: OfficeComponent,
    children: [
      {
        path: 'list',
        component: OfficesComponent,
      },
      {
        path: 'add',
        component: OfficeEditComponent
      },
      {
        path: 'edit/:id',
        component: OfficeEditComponent
      },
      {
        path: 'view/:id',
        component: OfficeEditComponent
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
export class OfficeRoutingModule {}
