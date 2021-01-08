import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ImageCropperModule } from 'ngx-image-cropper';

// import { CompanyModule } from './company/company.module';
// import { TypeCompanyModule } from './type-company/type-company.module';

// Users
import { UsersComponent } from './user/users/users.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/users/user-edit/user-edit.component';
import { UserAutocompleteComponent } from './user/users/user-autocomplete/user-autocomplete.component';

// TypeCompanies
import { TypesCompaniesComponent } from './type-company/types-companies/types-companies.component';
import { TypeCompanyComponent } from './type-company/type-company.component';
import { TypeCompanyEditComponent } from './type-company/types-companies/type-company-edit/type-company-edit.component';
import { TypeCompanyAutocompleteComponent } from './type-company/types-companies/autocomplete/autocomplete-type-company.component';

// SegmentCompanies
import { SegmentsCompaniesComponent } from './segment-company/segments-companies/segments-companies.component';
import { SegmentCompanyComponent } from './segment-company/segment-company.component';
import { SegmentCompanyEditComponent } from './segment-company/segments-companies/segment-company-edit/segment-company-edit.component';
import { SegmentCompanyAutocompleteComponent } from './segment-company/segments-companies/segment-company-autocomplete/segment-company-autocomplete.component';

// Companies
import { CompaniesComponent } from './company/companies/companies.component';
import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './company/companies/company-edit/company-edit.component';
import { CompanyAutocompleteComponent } from './company/companies/company-autocomplete/company-autocomplete.component';

// Departments
import { DepartmentsComponent } from './department/departments/departments.component';
import { DepartmentComponent } from './department/department.component';
import { DepartmentEditComponent } from './department/departments/department-edit/department-edit.component';
import { DepartmentAutocompleteComponent } from './department/departments/department-autocomplete/department-autocomplete.component';

// Offices
import { OfficesComponent } from './office/offices/offices.component';
import { OfficeComponent } from './office/office.component';
import { OfficeEditComponent } from './office/offices/office-edit/office-edit.component';
import { OfficeAutocompleteComponent } from './office/offices/office-autocomplete/office-autocomplete.component';

// Positions
import { PositionsComponent } from './position/positions/positions.component';
import { PositionComponent } from './position/position.component';
import { PositionEditComponent } from './position/positions/position-edit/position-edit.component';
import { PositionAutocompleteComponent } from './position/positions/position-autocomplete/position-autocomplete.component';

// Employees
import { EmployeesComponent } from './employee/employees/employees.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeEditComponent } from './employee/employees/employee-edit/employee-edit.component';
import { EmployeeAutocompleteComponent } from './employee/employees/employee-autocomplete/employee-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    DialogModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    ToggleButtonModule,
    ImageCropperModule,
    // CompanyModule,
    // TypeCompanyModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InlineSVGModule,
  ],
  declarations: [
    UsersComponent,
    UserComponent,
    UserEditComponent,
    UserAutocompleteComponent,
    TypesCompaniesComponent,
    TypeCompanyComponent,
    TypeCompanyEditComponent,
    TypeCompanyAutocompleteComponent,
    SegmentsCompaniesComponent,
    SegmentCompanyComponent,
    SegmentCompanyEditComponent,
    SegmentCompanyAutocompleteComponent,
    CompaniesComponent,
    CompanyComponent,
    CompanyEditComponent,
    CompanyAutocompleteComponent,
    OfficesComponent,
    OfficeComponent,
    OfficeEditComponent,
    OfficeAutocompleteComponent,
    DepartmentsComponent,
    DepartmentComponent,
    DepartmentEditComponent,
    DepartmentAutocompleteComponent,
    PositionsComponent,
    PositionComponent,
    PositionEditComponent,
    PositionAutocompleteComponent,
    EmployeesComponent,
    EmployeeComponent,
    EmployeeEditComponent,
    EmployeeAutocompleteComponent,
  ]
})
export class PagesModule { }
