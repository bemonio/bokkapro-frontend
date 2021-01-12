import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageComponent } from './package.component';
import { PackagesComponent } from './packages/packages.component';
import { PackageEditComponent } from './packages/package-edit/package-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PackageComponent,
    children: [
      {
        path: 'list',
        component: PackagesComponent,
      },
      {
        path: 'add',
        component: PackageEditComponent
      },
      {
        path: 'edit/:id',
        component: PackageEditComponent
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
export class PackageRoutingModule {}
