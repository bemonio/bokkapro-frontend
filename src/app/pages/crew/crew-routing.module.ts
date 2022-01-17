import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrewComponent } from './crew.component';
import { CrewsComponent } from './crews/crews.component';
import { CrewEditComponent } from './crews/crew-edit/crew-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CrewComponent,
    children: [
      {
        path: 'crews',
        component: CrewsComponent,
      },
      {
        path: 'add',
        component: CrewEditComponent
      },
      {
        path: 'edit/:id',
        component: CrewEditComponent
      },
      {
        path: 'view/:id',
        component: CrewEditComponent
      },
      { path: '', redirectTo: 'crews', pathMatch: 'full' },
      { path: '**', redirectTo: 'crews', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrewRoutingModule {}
