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
import { SegmentsCompaniesComponent } from './segments-companies/segments-companies.component';
import { SegmentCompanyComponent } from './segment-company.component';
// import { SegmentCompanyRoutingModule} from './segment-company-routing.module';
import { SegmentCompanyEditComponent } from './segments-companies/segment-company-edit/segment-company-edit.component';
import { SegmentCompanyAutocompleteComponent } from './segments-companies/segment-company-autocomplete/segment-company-autocomplete.component';
import { SegmentCompanyService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SegmentsCompaniesComponent,
    SegmentCompanyComponent,
    SegmentCompanyEditComponent,
    SegmentCompanyAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // SegmentCompanyRoutingModule,
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
    SegmentCompanyService,
    ConfirmationService
  ]
})
export class SegmentCompanyModule {}
