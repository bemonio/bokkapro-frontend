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
import { InvoiceItemsComponent } from './invoice-items/invoice-items.component';
import { InvoiceItemComponent } from './invoice-item.component';
// import { HeadInvoiceRoutingModule} from './invoice-item-routing.module';
import { InvoiceItemEditComponent } from './invoice-items/invoice-item-edit/invoice-item-edit.component';
import { InvoiceItemService } from './_services';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    InvoiceItemsComponent,
    InvoiceItemComponent,
    InvoiceItemEditComponent,
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
    InvoiceItemService,
    ConfirmationService
  ]
})
export class InvoiceItemModule {}
