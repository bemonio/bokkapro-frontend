import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { ReportRequestsComponent } from './report-requests/report-requests.component';
import { ReportRequestComponent } from './report-request.component';
import { ReportRequestRoutingModule } from './report-request-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportRequestService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    ReportRequestsComponent,
    ReportRequestComponent,
  ],
  imports: [
    CommonModule,
    ReportRequestRoutingModule,
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
    ReportRequestService,
    ConfirmationService
  ]
})
export class ReportRequestModule {}
