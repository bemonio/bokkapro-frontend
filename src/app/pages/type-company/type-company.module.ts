import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { TypesCompaniesComponent } from './types-companies/types-companies.component';
import { TypeCompanyComponent } from './type-company.component';
import { TypeCompanyRoutingModule } from './type-company-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeCompanyEditComponent } from './types-companies/type-company-edit/type-company-edit.component';
import { TypeCompanyService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    TypesCompaniesComponent,
    TypeCompanyComponent,
    TypeCompanyEditComponent,
  ],
  imports: [
    CommonModule,
    TypeCompanyRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule
  ],
  entryComponents: [
  ],
  providers: [
    TypeCompanyService,
    ConfirmationService
  ]
})
export class TypeCompanyModule {}
