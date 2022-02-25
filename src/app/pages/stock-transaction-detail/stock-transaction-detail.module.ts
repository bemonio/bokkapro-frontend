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
import { StockTransactionDetailsComponent } from './stock-transaction-details/stock-transaction-details.component';
import { StockTransactionDetailComponent } from './stock-transaction-detail.component';
// import { StockTransactionDetailRoutingModule} from './stock-transaction-detail-routing.module';
import { StockTransactionDetailEditComponent } from './stock-transaction-details/stock-transaction-detail-edit/stock-transaction-detail-edit.component';
import { StockTransactionDetailService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    StockTransactionDetailsComponent,
    StockTransactionDetailComponent,
    StockTransactionDetailEditComponent,
  ],
  imports: [
    CommonModule,
    // StockTransactionDetailRoutingModule,
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
    StockTransactionDetailService,
    ConfirmationService
  ]
})
export class StockTransactionDetailModule {}
