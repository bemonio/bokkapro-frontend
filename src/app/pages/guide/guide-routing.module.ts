import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuideComponent } from './guide.component';
import { GuidesComponent } from './guides/guides.component';
import { GuideEditComponent } from './guides/guide-edit/guide-edit.component';

const routes: Routes = [
  {
    path: '',
    component: GuideComponent,
    children: [
      {
        path: 'list',
        component: GuidesComponent,
      },
      {
        path: 'add',
        component: GuideEditComponent
      },
      {
        path: 'edit/:id',
        component: GuideEditComponent
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
export class GuideRoutingModule {}
