import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { ReportOperationsComponent } from './report-operations/report-operations.component';
import { ReportOperationComponent } from './report-operation.component';
import { ReportOperationRoutingModule } from './report-operation-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportOperationEditComponent } from './report-operations/report-operation-edit/report-operation-edit.component';
import { ReportOperationService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    ReportOperationsComponent,
    ReportOperationComponent,
    ReportOperationEditComponent,
  ],
  imports: [
    CommonModule,
    ReportOperationRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TranslateModule,
    ToggleButtonModule,
    ConfirmDialogModule
  ],
  entryComponents: [
  ],
  providers: [
    ReportOperationService,
    ConfirmationService
  ]
})
export class ReportOperationModule {}
