import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeDivisionComponent } from './type-division.component';
import { TypesDivisionsComponent } from './types-divisions/types-divisions.component';
import { TypeDivisionEditComponent } from './types-divisions/type-division-edit/type-division-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeDivisionComponent,
    children: [
      {
        path: 'list',
        component: TypesDivisionsComponent,
      },
      {
        path: 'add',
        component: TypeDivisionEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeDivisionEditComponent
      },
      {
        path: 'view/:id',
        component: TypeDivisionEditComponent
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
export class TypeDivisionRoutingModule {}
