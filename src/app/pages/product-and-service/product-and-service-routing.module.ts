import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductAndServiceComponent } from './product-and-service.component';
import { ProductAndServicesComponent } from './product-and-services/product-and-services.component';
import { ProductAndServiceEditComponent } from './product-and-services/product-and-service-edit/product-and-service-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductAndServiceComponent,
    children: [
      {
        path: 'list',
        component: ProductAndServicesComponent,
      },
      {
        path: 'add',
        component: ProductAndServiceEditComponent
      },
      {
        path: 'edit/:id',
        component: ProductAndServiceEditComponent
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
export class ProductAndServiceRoutingModule {}
