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
import { HeadInvoicesComponent } from './head-invoices/head-invoices.component';
import { HeadInvoiceComponent } from './head-invoice.component';
// import { HeadInvoiceRoutingModule} from './head-invoice-routing.module';
import { HeadInvoiceEditComponent } from './head-invoices/head-invoice-edit/head-invoice-edit.component';
import { HeadInvoiceService } from './_services';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeadInvoicesComponent,
    HeadInvoiceComponent,
    HeadInvoiceEditComponent,
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
    HeadInvoiceService,
    ConfirmationService
  ]
})
export class HeadInvoiceModule {}
