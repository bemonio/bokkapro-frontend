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
import { StocksComponent } from './stocks/stocks.component';
import { StockComponent } from './stock.component';
// import { StockRoutingModule} from './stock-routing.module';
import { StockEditComponent } from './stocks/stock-edit/stock-edit.component';
import { StockService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    StocksComponent,
    StockComponent,
    StockEditComponent,
  ],
  imports: [
    CommonModule,
    // StockRoutingModule,
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
    StockService,
    ConfirmationService
  ]
})
export class StockModule {}
