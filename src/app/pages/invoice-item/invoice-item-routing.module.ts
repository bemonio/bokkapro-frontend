import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceItemComponent } from './invoice-item.component';
import { InvoiceItemsComponent } from './invoice-items/invoice-items.component';
import { InvoiceItemEditComponent } from './invoice-items/invoice-item-edit/invoice-item-edit.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceItemComponent,
    children: [
      {
        path: 'list',
        component: InvoiceItemsComponent,
      },
      {
        path: 'add',
        component: InvoiceItemEditComponent
      },
      {
        path: 'edit/:id',
        component: InvoiceItemEditComponent
      },
      {
        path: 'view/:id',
        component: InvoiceItemEditComponent
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
export class InvoiceItemRoutingModule {}
