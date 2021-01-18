import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoucherComponent } from './voucher.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { VoucherEditComponent } from './vouchers/voucher-edit/voucher-edit.component';

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
        path: 'edit/:id',
        component: VoucherEditComponent
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
