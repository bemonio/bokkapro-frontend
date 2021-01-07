import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeEditComponent } from './employees/employee-edit/employee-edit.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'list',
        component: EmployeesComponent,
      },
      {
        path: 'add',
        component: EmployeeEditComponent
      },
      {
        path: 'edit/:id',
        component: EmployeeEditComponent
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
export class EmployeeRoutingModule {}
