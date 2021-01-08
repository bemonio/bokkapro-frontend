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
import { LocationsComponent } from './locations/locations.component';
import { LocationComponent } from './location.component';
// import { LocationRoutingModule} from './location-routing.module';
import { LocationEditComponent } from './locations/location-edit/location-edit.component';
import { LocationAutocompleteComponent } from './locations/location-autocomplete/location-autocomplete.component';
import { LocationService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LocationsComponent,
    LocationComponent,
    LocationEditComponent,
    LocationAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // LocationRoutingModule,
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
    LocationService,
    ConfirmationService
  ]
})
export class LocationModule {}
