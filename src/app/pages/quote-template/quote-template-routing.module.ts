import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteTemplateComponent } from './quote-template.component';
import { QuoteTemplatesComponent } from './quote-templates/quote-templates.component';
import { QuoteTemplateEditComponent } from './quote-templates/quote-template-edit/quote-template-edit.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteTemplateComponent,
    children: [
      {
        path: 'list',
        component: QuoteTemplatesComponent,
      },
      {
        path: 'add',
        component: QuoteTemplateEditComponent
      },
      {
        path: 'edit/:id',
        component: QuoteTemplateEditComponent
      },
      {
        path: 'view/:id',
        component: QuoteTemplateEditComponent
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
export class QuoteTemplateRoutingModule {}
