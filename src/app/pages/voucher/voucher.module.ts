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
import { VouchersComponent } from './vouchers/vouchers.component';
import { VoucherComponent } from './voucher.component';
// import { VoucherRoutingModule} from './voucher-routing.module';
import { VoucherEditComponent } from './vouchers/voucher-edit/voucher-edit.component';
import { VoucherAutocompleteComponent } from './vouchers/voucher-autocomplete/voucher-autocomplete.component';
import { VoucherService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    VouchersComponent,
    VoucherComponent,
    VoucherEditComponent,
    VoucherAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // VoucherRoutingModule,
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
    VoucherService,
    ConfirmationService
  ]
})
export class VoucherModule {}
