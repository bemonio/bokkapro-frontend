import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { ToursDetailsComponent } from './tours-details/tours-details.component';
import { TourDetailComponent } from './tour-detail.component';
import { TourDetailRoutingModule } from './tour-detail-routing.module';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TourDetailEditComponent } from './tours-details/tour-detail-edit/tour-detail-edit.component';
import { TourDetailService } from './_services/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    ToursDetailsComponent,
    TourDetailComponent,
    TourDetailEditComponent,
  ],
  imports: [
    CommonModule,
    TourDetailRoutingModule,
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
    TourDetailService,
    ConfirmationService
  ]
})
export class TourModule {}
