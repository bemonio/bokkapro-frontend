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
import { DepositFormsComponent } from './deposit-forms/deposit-forms.component';
import { DepositFormComponent } from './deposit-form.component';
// import { DepositFormRoutingModule} from './deposit-form-routing.module';
import { DepositFormEditComponent } from './deposit-forms/deposit-form-edit/deposit-form-edit.component';
import { DepositFormService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DepositFormsComponent,
    DepositFormComponent,
    DepositFormEditComponent,
  ],
  imports: [
    CommonModule,
    // DepositFormRoutingModule,
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
    DepositFormService,
    ConfirmationService
  ]
})
export class DepositFormModule {}
