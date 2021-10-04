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
import { CurrenciesComponent } from './currencies/currencies.component';
import { CurrencyComponent } from './currency.component';
// import { CurrencyRoutingModule} from './currency-routing.module';
import { CurrencyEditComponent } from './currencies/currency-edit/currency-edit.component';
import { CurrencySelectComponent } from './currencies/currency-select/currency-select.component';
import { CurrencyService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CurrenciesComponent,
    CurrencyComponent,
    CurrencyEditComponent,
    CurrencySelectComponent,
  ],
  imports: [
    CommonModule,
    // CurrencyRoutingModule,
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
    CurrencyService,
    ConfirmationService
  ]
})
export class CurrencyModule {}
