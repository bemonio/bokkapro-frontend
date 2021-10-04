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
import { DivisionsComponent } from './divisions/divisions.component';
import { DivisionComponent } from './division.component';
// import { DivisionRoutingModule} from './division-routing.module';
import { DivisionEditComponent } from './divisions/division-edit/division-edit.component';
import { DivisionAutocompleteComponent } from './divisions/division-autocomplete/division-autocomplete.component';
import { DivisionService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DivisionsComponent,
    DivisionComponent,
    DivisionEditComponent,
    DivisionAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // DivisionRoutingModule,
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
    DivisionService,
    ConfirmationService
  ]
})
export class DivisionModule {}
