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
import { PositionsComponent } from './positions/positions.component';
import { PositionComponent } from './position.component';
// import { PositionRoutingModule} from './position-routing.module';
import { PositionEditComponent } from './positions/position-edit/position-edit.component';
import { PositionAutocompleteComponent } from './positions/position-autocomplete/position-autocomplete.component';
import { PositionService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PositionsComponent,
    PositionComponent,
    PositionEditComponent,
    PositionAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // PositionRoutingModule,
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
    PositionService,
    ConfirmationService
  ]
})
export class PositionModule {}
