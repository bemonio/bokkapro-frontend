import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupComponent } from './group.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';

const routes: Routes = [
  {
    path: '',
    component: GroupComponent,
    children: [
      {
        path: 'list',
        component: GroupsComponent,
      },
      {
        path: 'add',
        component: GroupEditComponent
      },
      {
        path: 'edit/:id',
        component: GroupEditComponent
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
export class GroupRoutingModule {}
