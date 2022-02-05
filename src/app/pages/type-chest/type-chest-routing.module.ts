import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeChestComponent } from './type-chest.component';
import { TypesChestsComponent } from './types-chests/types-chests.component';
import { TypeChestEditComponent } from './types-chests/type-chest-edit/type-chest-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeChestComponent,
    children: [
      {
        path: 'list',
        component: TypesChestsComponent,
      },
      {
        path: 'add',
        component: TypeChestEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeChestEditComponent
      },
      {
        path: 'view/:id',
        component: TypeChestEditComponent
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
export class TypeChestRoutingModule {}
