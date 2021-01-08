import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZoneComponent } from './zone.component';
import { ZonesComponent } from './zones/zones.component';
import { ZoneEditComponent } from './zones/zone-edit/zone-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ZoneComponent,
    children: [
      {
        path: 'list',
        component: ZonesComponent,
      },
      {
        path: 'add',
        component: ZoneEditComponent
      },
      {
        path: 'edit/:id',
        component: ZoneEditComponent
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
export class ZoneRoutingModule {}
