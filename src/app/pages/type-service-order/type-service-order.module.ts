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
import { TypesServiceOrdersComponent } from './types-service-orders/types-service-orders.component';
import { TypeServiceOrderComponent } from './type-service-order.component';
// import { TypeServiceOrderRoutingModule} from './type-service-order-routing.module';
import { TypeServiceOrderEditComponent } from './types-service-orders/type-service-order-edit/type-service-order-edit.component';
import { TypeServiceOrderService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesServiceOrdersComponent,
    TypeServiceOrderComponent,
    TypeServiceOrderEditComponent,
  ],
  imports: [
    CommonModule,
    // TypeServiceOrderRoutingModule,
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
    TypeServiceOrderService,
    ConfirmationService
  ]
})
export class TypeServiceOrderModule {}
