import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TypesCompaniesComponent } from './types-companies/types-companies.component';
import { TypeCompanyComponent } from './type-company.component';
// import { TypeCompanyRoutingModule} from './type-company-routing.module';
import { TypeCompanyEditComponent } from './types-companies/type-company-edit/type-company-edit.component';
import { TypeCompanyAutocompleteComponent } from './types-companies/type-company-autocomplete/type-company-autocomplete.component';
import { TypeCompanyService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesCompaniesComponent,
    TypeCompanyComponent,
    TypeCompanyEditComponent,
    TypeCompanyAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // TypeCompanyRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TranslateModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    RouterModule
  ],
  entryComponents: [
  ],
  providers: [
    TypeCompanyService,
    ConfirmationService
  ]
})
export class TypeCompanyModule {}
