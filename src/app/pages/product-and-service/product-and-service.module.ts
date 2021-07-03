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
import { ProductAndServicesComponent } from './product-and-services/product-and-services.component';
import { ProductAndServiceComponent } from './product-and-service.component';
// import { ProductAndServiceRoutingModule} from './product-and-service-routing.module';
import { ProductAndServiceEditComponent } from './product-and-services/product-and-service-edit/product-and-service-edit.component';
import { ProductAndServiceService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProductAndServicesComponent,
    ProductAndServiceComponent,
    ProductAndServiceEditComponent,
  ],
  imports: [
    CommonModule,
    // ProductAndServiceRoutingModule,
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
    ProductAndServiceService,
    ConfirmationService
  ]
})
export class ProductAndServiceModule {}
