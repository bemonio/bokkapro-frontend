import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionComponent } from './permission.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionEditComponent } from './permissions/permission-edit/permission-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionComponent,
    children: [
      {
        path: 'list',
        component: PermissionsComponent,
      },
      {
        path: 'add',
        component: PermissionEditComponent
      },
      {
        path: 'edit/:id',
        component: PermissionEditComponent
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
export class PermissionRoutingModule {}
