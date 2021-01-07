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
import { OfficesComponent } from './offices/offices.component';
import { OfficeComponent } from './office.component';
// import { OfficeRoutingModule} from './office-routing.module';
import { OfficeEditComponent } from './offices/office-edit/office-edit.component';
import { OfficeAutocompleteComponent } from './offices/office-autocomplete/office-autocomplete.component';
import { OfficeService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    OfficesComponent,
    OfficeComponent,
    OfficeEditComponent,
    OfficeAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // OfficeRoutingModule,
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
    OfficeService,
    ConfirmationService
  ]
})
export class OfficeModule {}
