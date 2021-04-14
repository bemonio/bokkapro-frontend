import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { PackingsComponent } from './packings/packings.component';
import { PackingComponent } from './packing.component';
// import { PackingRoutingModule} from './packing-routing.module';
import { PackingEditComponent } from './packings/packing-edit/packing-edit.component';
import { PackingAutocompleteComponent } from './packings/packing-autocomplete/packing-autocomplete.component';
import { PackingService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PackingsComponent,
    PackingComponent,
    PackingEditComponent,
    PackingAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // PackingRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    FileUploadModule,
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    PackingService,
    ConfirmationService
  ]
})
export class PackingModule {}
