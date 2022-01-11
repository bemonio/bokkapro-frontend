import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChestComponent } from './chest.component';
import { ChestsComponent } from './chests/chests.component';
import { ChestEditComponent } from './chests/chest-edit/chest-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ChestComponent,
    children: [
      {
        path: 'list',
        component: ChestsComponent,
      },
      {
        path: 'add',
        component: ChestEditComponent
      },
      {
        path: 'edit/:id',
        component: ChestEditComponent
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
export class ChestRoutingModule {}
