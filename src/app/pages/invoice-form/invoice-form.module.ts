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
import { InvoiceFormsComponent } from './invoice-forms/invoice-forms.component';
import { InvoiceFormComponent } from './invoice-form.component';
// import { DepositFormRoutingModule} from './deposit-form-routing.module';
import { InvoiceFormEditComponent } from './invoice-forms/invoice-form-edit/invoice-form-edit.component';
import { InvoiceFormAutocompleteComponent } from './invoice-forms/invoice-form-autocomplete/invoice-form-autocomplete.component';
import { InvoiceFormService } from './_services';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    InvoiceFormsComponent,
    InvoiceFormComponent,
    InvoiceFormEditComponent,
    InvoiceFormAutocompleteComponent,
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
    InvoiceFormService,
    ConfirmationService
  ]
})
export class DepositFormModule {}
