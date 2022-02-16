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
import { TypesProductTransactionsComponent } from './types-product-transactions/types-product-transactions.component';
import { TypeProductTransactionComponent } from './type-product-transaction.component';
// import { TypeProductTransactionRoutingModule} from './type-product-transaction-routing.module';
import { TypeProductTransactionEditComponent } from './types-product-transactions/type-product-transaction-edit/type-product-transaction-edit.component';
import { TypeProductTransactionSelectComponent } from './types-product-transactions/type-product-transaction-select/type-product-transaction-select.component';
import { TypeProductTransactionService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesProductTransactionsComponent,
    TypeProductTransactionComponent,
    TypeProductTransactionEditComponent,
    TypeProductTransactionSelectComponent,
  ],
  imports: [
    CommonModule,
    // TypeProductTransactionRoutingModule,
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
    RouterModule
  ],
  entryComponents: [
  ],
  providers: [
    TypeProductTransactionService,
    ConfirmationService
  ]
})
export class TypeProductTransactionModule {}
