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
import { TypesCurrenciesComponent } from './types-currencies/types-currencies.component';
import { TypeCurrencyComponent } from './type-currency.component';
// import { TypeCurrencyRoutingModule} from './type-currency-routing.module';
import { TypeCurrencyEditComponent } from './types-currencies/type-currency-edit/type-currency-edit.component';
import { TypeCurrencyService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesCurrenciesComponent,
    TypeCurrencyComponent,
    TypeCurrencyEditComponent,
  ],
  imports: [
    CommonModule,
    // TypeCurrencyRoutingModule,
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
    TypeCurrencyService,
    ConfirmationService
  ]
})
export class TypeCurrencyModule {}
