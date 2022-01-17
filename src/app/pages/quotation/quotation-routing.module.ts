import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationComponent } from './quotation.component';
import { QuotationsComponent } from './quotations/quotations.component';
import { QuotationEditComponent } from './quotations/quotation-edit/quotation-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
    children: [
      {
        path: 'list',
        component: QuotationsComponent,
      },
      {
        path: 'add',
        component: QuotationEditComponent
      },
      {
        path: 'edit/:id',
        component: QuotationEditComponent
      },
      {
        path: 'view/:id',
        component: QuotationEditComponent
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
export class QuotationRoutingModule {}
