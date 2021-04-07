import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyContactComponent } from './company-contact.component';
import { CompanyContactsComponent } from './company-contacts/company-contacts.component';
import { CompanyContactEditComponent } from './company-contacts/company-contact-edit/company-contact-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyContactComponent,
    children: [
      {
        path: 'list',
        component: CompanyContactsComponent,
      },
      {
        path: 'add',
        component: CompanyContactEditComponent
      },
      {
        path: 'edit/:id',
        component: CompanyContactEditComponent
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
export class CompanyContactRoutingModule {}
