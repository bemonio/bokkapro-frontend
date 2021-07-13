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
import { OriginDestinationsComponent } from './origin-destinations/origin-destinations.component';
import { OriginDestinationComponent } from './origin-destination.component';
// import { OriginDestinationRoutingModule} from './origin-destination-routing.module';
import { OriginDestinationEditComponent } from './origin-destinations/origin-destination-edit/origin-destination-edit.component';
import { OriginDestinationService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    OriginDestinationsComponent,
    OriginDestinationComponent,
    OriginDestinationEditComponent,
  ],
  imports: [
    CommonModule,
    // OriginDestinationRoutingModule,
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
    OriginDestinationService,
    ConfirmationService
  ]
})
export class OriginDestinationModule {}
