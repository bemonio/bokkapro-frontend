import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceComponent } from './invoice.component';
// import { DepositFormRoutingModule} from './deposit-form-routing.module';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';
import { InvoiceAutocompleteComponent } from './invoices/invoice-autocomplete/invoice-autocomplete.component';
import { InvoiceService } from './_services';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    InvoicesComponent,
    InvoiceComponent,
    InvoiceEditComponent,
    InvoiceAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // DepositFormRoutingModule,
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
    FileUploadModule,
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    InvoiceService,
    ConfirmationService
  ]
})
export class DepositFormModule {}
