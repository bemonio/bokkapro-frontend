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
import { TypesLocationsComponent } from './types-locations/types-locations.component';
import { TypeLocationComponent } from './type-location.component';
// import { TypeLocationRoutingModule} from './type-location-routing.module';
import { TypeLocationEditComponent } from './types-locations/type-location-edit/type-location-edit.component';
import { TypeLocationAutocompleteComponent } from './types-locations/type-location-autocomplete/type-location-autocomplete.component';
import { TypeLocationService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesLocationsComponent,
    TypeLocationComponent,
    TypeLocationEditComponent,
    TypeLocationAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // TypeLocationRoutingModule,
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
    TypeLocationService,
    ConfirmationService
  ]
})
export class TypeLocationModule {}
