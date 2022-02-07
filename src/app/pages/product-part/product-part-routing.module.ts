import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductPartComponent } from './product-part.component';
import { ProductPartsComponent } from './product-parts/product-parts.component';
import { ProductPartEditComponent } from './product-parts/product-part-edit/product-part-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductPartComponent,
    children: [
      {
        path: 'list',
        component: ProductPartsComponent,
      },
      {
        path: 'add',
        component: ProductPartEditComponent
      },
      {
        path: 'edit/:id',
        component: ProductPartEditComponent
      },
      {
        path: 'view/:id',
        component: ProductPartEditComponent
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
export class ProductPartRoutingModule {}
