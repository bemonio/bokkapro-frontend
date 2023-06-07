import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordSettingComponent } from './password-setting.component';
import { PasswordsSettingsComponent } from './passwords-settings/passwords-settings.component';
import { PasswordSettingEditComponent } from './passwords-settings/password-setting-edit/password-setting-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PasswordSettingComponent,
    children: [
      {
        path: 'list',
        component: PasswordsSettingsComponent,
      },
      {
        path: 'add',
        component: PasswordSettingEditComponent
      },
      {
        path: 'edit/:id',
        component: PasswordSettingEditComponent
      },
      {
        path: 'view/:id',
        component: PasswordSettingEditComponent
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
export class PasswordSettingRoutingModule {}
