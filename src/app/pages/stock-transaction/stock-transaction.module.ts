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
import { StockTransactionsComponent } from './stock-transactions/stock-transactions.component';
import { StockTransactionComponent } from './stock-transaction.component';
// import { StockTransactionRoutingModule} from './stock-transaction-routing.module';
import { StockTransactionEditComponent } from './stock-transactions/stock-transaction-edit/stock-transaction-edit.component';
import { StockTransactionService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    StockTransactionsComponent,
    StockTransactionComponent,
    StockTransactionEditComponent,
  ],
  imports: [
    CommonModule,
    // StockTransactionRoutingModule,
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
    StockTransactionService,
    ConfirmationService
  ]
})
export class StockTransactionModule {}
