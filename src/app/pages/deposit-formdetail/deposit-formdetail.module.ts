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
import { DepositFormsDetailsComponent } from './deposit-formsdetails/deposit-formsdetails.component';
import { DepositFormDetailComponent } from './deposit-formdetail.component';
// import { DepositFormDetailRoutingModule} from './deposit-form-routing.module';
import { DepositFormDetailEditComponent } from './deposit-formsdetails/deposit-formdetail-edit/deposit-formdetail-edit.component';
import { DepositFormDetailService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DepositFormsDetailsComponent,
    DepositFormDetailComponent,
    DepositFormDetailEditComponent,
  ],
  imports: [
    CommonModule,
    // DepositFormDetailRoutingModule,
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
    DepositFormDetailService,
    ConfirmationService
  ]
})
export class DepositFormDetailModule {}
