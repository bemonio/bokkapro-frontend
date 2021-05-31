import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DivisionComponent } from './division.component';
import { DivisionsComponent } from './divisions/divisions.component';
import { DivisionEditComponent } from './divisions/division-edit/division-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DivisionComponent,
    children: [
      {
        path: 'list',
        component: DivisionsComponent,
      },
      {
        path: 'add',
        component: DivisionEditComponent
      },
      {
        path: 'edit/:id',
        component: DivisionEditComponent,
        children: [
          {
            path: 'employees',
            loadChildren: () =>
              import('../../pages/employee/employee-routing.module').then(
                (m) => m.EmployeeRoutingModule
              ),
          },
          {
            path: 'crews',
            loadChildren: () =>
              import('../../pages/crew/crew-routing.module').then(
                (m) => m.CrewRoutingModule
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
export class DivisionRoutingModule {}
