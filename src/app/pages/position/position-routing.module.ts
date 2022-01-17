import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PositionComponent } from './position.component';
import { PositionsComponent } from './positions/positions.component';
import { PositionEditComponent } from './positions/position-edit/position-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PositionComponent,
    children: [
      {
        path: 'list',
        component: PositionsComponent,
      },
      {
        path: 'add',
        component: PositionEditComponent
      },
      {
        path: 'edit/:id',
        component: PositionEditComponent
      },
      {
        path: 'view/:id',
        component: PositionEditComponent
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
export class PositionRoutingModule {}
