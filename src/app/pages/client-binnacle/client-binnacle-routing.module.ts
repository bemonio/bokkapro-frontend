import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientBinnacleComponent } from './client-binnacle.component';
import { ClientBinnaclesComponent } from './client-binnacles/client-binnacles.component';
import { ClientBinnacleEditComponent } from './client-binnacles/client-binnacle-edit/client-binnacle-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ClientBinnacleComponent,
    children: [
      {
        path: 'list',
        component: ClientBinnaclesComponent,
      },
      {
        path: 'add',
        component: ClientBinnacleEditComponent
      },
      {
        path: 'edit/:id',
        component: ClientBinnacleEditComponent
      },
      {
        path: 'view/:id',
        component: ClientBinnacleEditComponent
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
export class ClientBinnacleRoutingModule {}
