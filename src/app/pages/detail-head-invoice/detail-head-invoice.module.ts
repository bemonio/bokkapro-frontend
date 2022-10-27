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
import { DetailHeadInvoicesComponent } from './detail-head-invoices/detail-head-invoices.component';
import { DetailHeadInvoiceComponent } from './detail-head-invoice.component';
// import { HeadInvoiceRoutingModule} from './detail-head-invoice-routing.module';
import { DetailHeadInvoiceEditComponent } from './detail-head-invoices/detail-head-invoice-edit/detail-head-invoice-edit.component';
import { DetailHeadInvoiceService } from './_services';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DetailHeadInvoicesComponent,
    DetailHeadInvoiceComponent,
    DetailHeadInvoiceEditComponent,
  ],
  imports: [
    CommonModule,
    // HeadInvoiceRoutingModule,
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
    DetailHeadInvoiceService,
    ConfirmationService
  ]
})
export class HeadInvoiceModule {}
