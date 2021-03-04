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
import { ExchangesComponent } from './exchanges/exchanges.component';
import { ExchangeComponent } from './exchange.component';
// import { ExchangeRoutingModule} from './exchange-routing.module';
import { ExchangeEditComponent } from './exchanges/exchange-edit/exchange-edit.component';
import { ExchangeService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ExchangesComponent,
    ExchangeComponent,
    ExchangeEditComponent,
  ],
  imports: [
    CommonModule,
    // ExchangeRoutingModule,
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
    ExchangeService,
    ConfirmationService
  ]
})
export class ExchangeModule {}
