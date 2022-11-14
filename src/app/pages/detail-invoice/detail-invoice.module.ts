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
import { DetailInvoicesComponent } from './detail-invoices/detail-invoices.component';
import { DetailInvoiceComponent } from './detail-invoice.component';
// import { HeadInvoiceRoutingModule} from './detail-invoice-routing.module';
import { DetailInvoiceEditComponent } from './detail-invoices/detail-invoice-edit/detail-invoice-edit.component';
import { DetailInvoiceService } from './_services';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DetailInvoicesComponent,
    DetailInvoiceComponent,
    DetailInvoiceEditComponent,
  ],
  imports: [
    CommonModule,
    // InvoiceRoutingModule,
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
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    DetailInvoiceService,
    ConfirmationService
  ]
})
export class DetailInvoiceModule {}
