import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationEditComponent } from './notifications/notification-edit/notification-edit.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    children: [
      {
        path: 'list',
        component: NotificationsComponent,
      },
      {
        path: 'add',
        component: NotificationEditComponent
      },
      {
        path: 'edit/:id',
        component: NotificationEditComponent
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
export class NotificationRoutingModule {}
