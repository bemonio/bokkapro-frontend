import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModerationComponent } from './moderation.component';
import { ModerationsComponent } from './moderations/moderations.component';
import { ModerationEditComponent } from './moderations/moderation-edit/moderation-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ModerationComponent,
    children: [
      {
        path: 'list',
        component: ModerationsComponent,
      },
      {
        path: 'add',
        component: ModerationEditComponent
      },
      {
        path: 'edit/:id',
        component: ModerationEditComponent
      },
      {
        path: 'view/:id',
        component: ModerationEditComponent
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
export class ModerationRoutingModule {}
