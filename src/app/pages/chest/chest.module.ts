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
import { ChestsComponent } from './chests/chests.component';
import { ChestComponent } from './chest.component';
// import { ChestRoutingModule} from './chest-routing.module';
import { ChestEditComponent } from './chests/chest-edit/chest-edit.component';
import { ChestService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ChestsComponent,
    ChestComponent,
    ChestEditComponent,
  ],
  imports: [
    CommonModule,
    // ChestRoutingModule,
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
    ChestService,
    ConfirmationService
  ]
})
export class ChestModule {}
