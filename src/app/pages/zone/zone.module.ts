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
import { ZonesComponent } from './zones/zones.component';
import { ZoneComponent } from './zone.component';
// import { ZoneRoutingModule} from './zone-routing.module';
import { ZoneEditComponent } from './zones/zone-edit/zone-edit.component';
import { ZoneAutocompleteComponent } from './zones/zone-autocomplete/zone-autocomplete.component';
import { ZoneService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ZonesComponent,
    ZoneComponent,
    ZoneEditComponent,
    ZoneAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // ZoneRoutingModule,
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
    ZoneService,
    ConfirmationService
  ]
})
export class ZoneModule {}
