import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';

// import { CompanyModule } from './company/company.module';
// import { TypeCompanyModule } from './type-company/type-company.module';
import { TypesCompaniesComponent } from './type-company/types-companies/types-companies.component';
import { TypeCompanyComponent } from './type-company/type-company.component';
import { TypeCompanyEditComponent } from './type-company/types-companies/type-company-edit/type-company-edit.component';
import { TypeCompanyAutocompleteComponent } from './type-company/types-companies/autocomplete/autocomplete-type-company.component';
import { CompaniesComponent } from './company/companies/companies.component';
import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './company/companies/company-edit/company-edit.component';
import { CompanyAutocompleteComponent } from './company/companies/autocomplete/autocomplete-company.component';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    ToggleButtonModule,
    // CompanyModule,
    // TypeCompanyModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InlineSVGModule,
  ],
  declarations: [
    TypesCompaniesComponent,
    TypeCompanyComponent,
    TypeCompanyEditComponent,
    TypeCompanyAutocompleteComponent,
    CompaniesComponent,
    CompanyComponent,
    CompanyEditComponent,
    CompanyAutocompleteComponent,
  ]
})
export class PagesModule { }
