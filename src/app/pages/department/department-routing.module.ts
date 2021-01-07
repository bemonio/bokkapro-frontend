import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentComponent } from './department.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentEditComponent } from './departments/department-edit/department-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent,
    children: [
      {
        path: 'list',
        component: DepartmentsComponent,
      },
      {
        path: 'add',
        component: DepartmentEditComponent
      },
      {
        path: 'edit/:id',
        component: DepartmentEditComponent
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
export class DepartmentRoutingModule {}
