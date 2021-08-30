import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoucherComponent } from './voucher.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { VoucherEditComponent } from './vouchers/voucher-edit/voucher-edit.component';
import { VoucherAddListComponent } from './vouchers/voucher-add-list/voucher-add-list.component';

const routes: Routes = [
  {
    path: '',
    component: VoucherComponent,
    children: [
      {
        path: 'list',
        component: VouchersComponent,
      },
      {
        path: 'add',
        component: VoucherEditComponent
      },
      {
        path: 'addList',
        component: VoucherAddListComponent
      },
      {
        path: 'edit/:id',
        component: VoucherEditComponent,
        children: [
          {
            path: 'packings',
            loadChildren: () =>
              import('../../pages/packing/packing-routing.module').then(
                (m) => m.PackingRoutingModule
              ),
          },
          {
            path: 'guides',
            loadChildren: () =>
              import('../../pages/guide/guide-routing.module').then(
                (m) => m.GuideRoutingModule
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
export class VoucherRoutingModule {}
