import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyComponent } from './company.component';
// import { CompanyRoutingModule} from './company-routing.module';
import { CompanyEditComponent } from './companies/company-edit/company-edit.component';
import { CompanyAutocompleteComponent } from './companies/company-autocomplete/company-autocomplete.component';
import { CompanyService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyComponent,
    CompanyEditComponent,
    CompanyAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // CompanyRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    FileUploadModule,
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    CompanyService,
    ConfirmationService
  ]
})
export class CompanyModule {}
