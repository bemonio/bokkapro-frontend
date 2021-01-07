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
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentComponent } from './department.component';
// import { DepartmentRoutingModule} from './department-routing.module';
import { DepartmentEditComponent } from './departments/department-edit/department-edit.component';
import { DepartmentAutocompleteComponent } from './departments/department-autocomplete/department-autocomplete.component';
import { DepartmentService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DepartmentsComponent,
    DepartmentComponent,
    DepartmentEditComponent,
    DepartmentAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // DepartmentRoutingModule,
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
    DepartmentService,
    ConfirmationService
  ]
})
export class DepartmentModule {}
