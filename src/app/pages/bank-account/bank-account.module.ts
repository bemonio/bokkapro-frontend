import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BanksAccountsComponent } from './banks-accounts/banks-accounts.component';
import { BankAccountComponent } from './bank-account.component';
// import { BankAccountRoutingModule} from './bank-account-routing.module';
import { BankAccountEditComponent } from './banks-accounts/bank-account-edit/bank-account-edit.component';
import { BankAccountAutocompleteComponent } from './banks-accounts/bank-account-autocomplete/bank-account-autocomplete.component';
import { BankAccountService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BanksAccountsComponent,
    BankAccountComponent,
    BankAccountEditComponent,
    BankAccountAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // BankAccountRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    RouterModule
  ],
  entryComponents: [
  ],
  providers: [
    BankAccountService,
    ConfirmationService
  ]
})
export class BankAccountModule {}
