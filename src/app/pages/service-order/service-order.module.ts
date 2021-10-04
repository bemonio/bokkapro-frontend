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
import { ServiceOrdersComponent } from './service-orders/service-orders.component';
import { ServiceOrderComponent } from './service-order.component';
// import { ServiceOrderRoutingModule} from './service-order-routing.module';
import { ServiceOrderEditComponent } from './service-orders/service-order-edit/service-order-edit.component';
import { ServiceOrderService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ServiceOrdersComponent,
    ServiceOrderComponent,
    ServiceOrderEditComponent,
  ],
  imports: [
    CommonModule,
    // ServiceOrderRoutingModule,
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
    ServiceOrderService,
    ConfirmationService
  ]
})
export class ServiceOrderModule {}
