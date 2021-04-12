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
import { QuotationsComponent } from './quotations/quotations.component';
import { QuotationComponent } from './quotation.component';
// import { quotationRoutingModule} from './quotation-routing.module';
import { QuotationEditComponent } from './quotations/quotation-edit/quotation-edit.component';
import { QuotationService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    QuotationsComponent,
    QuotationComponent,
    QuotationEditComponent,
  ],
  imports: [
    CommonModule,
    // quotationRoutingModule,
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
    QuotationService,
    ConfirmationService
  ]
})
export class quotationModule {}
