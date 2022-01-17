import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeGuideComponent } from './type-guide.component';
import { TypesGuidesComponent } from './types-guides/types-guides.component';
import { TypeGuideEditComponent } from './types-guides/type-guide-edit/type-guide-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TypeGuideComponent,
    children: [
      {
        path: 'list',
        component: TypesGuidesComponent,
      },
      {
        path: 'add',
        component: TypeGuideEditComponent
      },
      {
        path: 'edit/:id',
        component: TypeGuideEditComponent
      },
      {
        path: 'view/:id',
        component: TypeGuideEditComponent
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
export class TypeGuideRoutingModule {}
