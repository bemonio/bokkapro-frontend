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
import { DocumentsServicesOrdersComponent } from './documents-services-orders/documents-services-orders.component';
import { DocumentServiceOrderComponent } from './document-service-order.component';
// import { DocumentServiceOrderRoutingModule} from './document-service-order-routing.module';
import { DocumentServiceOrderEditComponent } from './documents-services-orders/document-service-order-edit/document-service-order-edit.component';
import { DocumentServiceOrderService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DocumentsServicesOrdersComponent,
    DocumentServiceOrderComponent,
    DocumentServiceOrderEditComponent,
  ],
  imports: [
    CommonModule,
    // DocumentServiceOrderRoutingModule,
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
    DocumentServiceOrderService,
    ConfirmationService
  ]
})
export class DocumentServiceOrderModule {}
