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
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employee.component';
// import { EmployeeRoutingModule} from './employee-routing.module';
import { EmployeeEditComponent } from './employees/employee-edit/employee-edit.component';
import { EmployeeAutocompleteComponent } from './employees/employee-autocomplete/employee-autocomplete.component';
import { EmployeeService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeComponent,
    EmployeeEditComponent,
    EmployeeAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // EmployeeRoutingModule,
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
    EmployeeService,
    ConfirmationService
  ]
})
export class EmployeeModule {}
