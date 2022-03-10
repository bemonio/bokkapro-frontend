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
import { StockSerialsComponent } from './stock-serials/stock-serials.component';
import { StockSerialComponent } from './stock-serial.component';
// import { StockSerialRoutingModule} from './stock-serial-routing.module';
import { StockSerialEditComponent } from './stock-serials/stock-serial-edit/stock-serial-edit.component';
import { StockSerialService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    StockSerialsComponent,
    StockSerialComponent,
    StockSerialEditComponent,
  ],
  imports: [
    CommonModule,
    // StockSerialRoutingModule,
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
    StockSerialService,
    ConfirmationService
  ]
})
export class StockSerialModule {}
