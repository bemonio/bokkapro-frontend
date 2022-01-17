import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClauseComponent } from './clause.component';
import { ClausesComponent } from './clauses/clauses.component';
import { ClauseEditComponent } from './clauses/clause-edit/clause-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ClauseComponent,
    children: [
      {
        path: 'list',
        component: ClausesComponent,
      },
      {
        path: 'add',
        component: ClauseEditComponent
      },
      {
        path: 'edit/:id',
        component: ClauseEditComponent
      },
      {
        path: 'view/:id',
        component: ClauseEditComponent
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
export class ClauseRoutingModule {}
