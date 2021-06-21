import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertifiedCartComponent } from './certified-cart.component';
import { CertifiedCartsComponent } from './certified-carts/certified-carts.component';
import { CertifiedCartEditComponent } from './certified-carts/certified-cart-edit/certified-cart-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CertifiedCartComponent,
    children: [
      {
        path: 'certifiedcarts',
        component: CertifiedCartsComponent,
      },
      {
        path: 'add',
        component: CertifiedCartEditComponent
      },
      {
        path: 'edit/:id',
        component: CertifiedCartEditComponent,
        children: [
          {
            path: 'vouchers',
            loadChildren: () =>
              import('../../pages/voucher/voucher-routing.module').then(
                (m) => m.VoucherRoutingModule
              ),
          },
        ]
      },
      { path: '', redirectTo: 'certifiedcarts', pathMatch: 'full' },
      { path: '**', redirectTo: 'certifiedcarts', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertifiedCartRoutingModule {}
