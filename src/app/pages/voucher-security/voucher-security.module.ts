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
import { VouchersSecuritiesComponent } from './vouchers-securities/vouchers-securities.component';
import { VoucherSecurityComponent } from './voucher-security.component';
// import { VoucherRoutingModule} from './voucher-security-routing.module';
import { VoucherSecurityEditComponent } from './vouchers-securities/voucher-security-edit/voucher-security-edit.component';
import { VoucherSecurityAutocompleteComponent } from './vouchers-securities/voucher-security-autocomplete/voucher-security-autocomplete.component';
import { VoucherSecurityAddListComponent } from './vouchers-securities/voucher-security-add-list/voucher-security-add-list.component';
import { VoucherSecurityService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    VouchersSecuritiesComponent,
    VoucherSecurityComponent,
    VoucherSecurityEditComponent,
    VoucherSecurityAutocompleteComponent,
    VoucherSecurityAddListComponent,
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
    VoucherSecurityService,
    ConfirmationService
  ]
})
export class VoucherModule {}
