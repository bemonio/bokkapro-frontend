import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { CertifiedCartsComponent } from './certified-carts/certified-carts.component';
import { CertifiedCartComponent } from './certified-cart.component';
import { CertifiedCartRoutingModule } from './certified-cart-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CertifiedCartEditComponent } from './certified-carts/certified-cart-edit/certified-cart-edit.component';
import { CertifiedCartService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    CertifiedCartsComponent,
    CertifiedCartComponent,
    CertifiedCartEditComponent,
  ],
  imports: [
    CommonModule,
    CertifiedCartRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule
  ],
  entryComponents: [
  ],
  providers: [
    CertifiedCartService,
    ConfirmationService
  ]
})
export class CertifiedCartModule {}
