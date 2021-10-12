import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoucherSecurityComponent } from './voucher-security.component';
import { VouchersSecuritiesComponent } from './vouchers-securities/vouchers-securities.component';
import { VoucherSecurityEditComponent } from './vouchers-securities/voucher-security-edit/voucher-security-edit.component';
import { VoucherSecurityAddListComponent } from './vouchers-securities/voucher-security-add-list/voucher-security-add-list.component';

const routes: Routes = [
  {
    path: '',
    component: VoucherSecurityComponent,
    children: [
      {
        path: 'list',
        component: VouchersSecuritiesComponent,
      },
      {
        path: 'add',
        component: VoucherSecurityEditComponent
      },
      {
        path: 'addList',
        component: VoucherSecurityAddListComponent
      },
      {
        path: 'edit/:id',
        component: VoucherSecurityEditComponent,
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
export class VoucherSecurityRoutingModule {}
