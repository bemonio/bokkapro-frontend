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
import { CurrenciesDetailsComponent } from './currencies-details/currencies-details.component';
import { CurrencyDetailComponent } from './currency-detail.component';
// import { CurrencyDetailRoutingModule} from './currency-detail-routing.module';
import { CurrencyDetailEditComponent } from './currencies-details/currency-detail-edit/currency-detail-edit.component';
import { CurrencyDetailService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CurrenciesDetailsComponent,
    CurrencyDetailComponent,
    CurrencyDetailEditComponent,
  ],
  imports: [
    CommonModule,
    // CurrencyDetailRoutingModule,
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
    CurrencyDetailService,
    ConfirmationService
  ]
})
export class CurrencyDetailModule {}
