import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentTypeComponent } from './content-type.component';
import { ContentTypesComponent } from './content-types/content-types.component';
import { ContentTypeEditComponent } from './content-types/content-type-edit/content-type-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ContentTypeComponent,
    children: [
      {
        path: 'list',
        component: ContentTypesComponent,
      },
      {
        path: 'add',
        component: ContentTypeEditComponent
      },
      {
        path: 'edit/:id',
        component: ContentTypeEditComponent,
        children: [
          {
            path: 'origindestinations',
            loadChildren: () =>
              import('../../pages/origin-destination/origin-destination-routing.module').then(
                (m) => m.OriginDestinationRoutingModule
            ),
          },
        ]
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
export class ContentTypeRoutingModule {}
