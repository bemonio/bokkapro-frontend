import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleComponent } from './vehicle.component';
import { VehicleRoutingModule } from './vehicle-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleEditComponent } from './vehicles/vehicle-edit/vehicle-edit.component';
import { VehicleService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    VehiclesComponent,
    VehicleComponent,
    VehicleEditComponent,
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TranslateModule,
    ToggleButtonModule,
    ConfirmDialogModule
  ],
  entryComponents: [
  ],
  providers: [
    VehicleService,
    ConfirmationService
  ]
})
export class VehicleModule {}
