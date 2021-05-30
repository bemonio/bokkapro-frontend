import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { CrewsComponent } from './crews/crews.component';
import { CrewComponent } from './crew.component';
import { CrewRoutingModule } from './crew-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CrewEditComponent } from './crews/crew-edit/crew-edit.component';
import { CrewService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    CrewsComponent,
    CrewComponent,
    CrewEditComponent,
  ],
  imports: [
    CommonModule,
    CrewRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule
  ],
  entryComponents: [
  ],
  providers: [
    CrewService,
    ConfirmationService
  ]
})
export class CrewModule {}
