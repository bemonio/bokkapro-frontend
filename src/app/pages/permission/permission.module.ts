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
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionComponent } from './permission.component';
// import { PermissionRoutingModule} from './permission-routing.module';
import { PermissionEditComponent } from './permissions/permission-edit/permission-edit.component';
import { PermissionAutocompleteComponent } from './permissions/permission-autocomplete/permission-autocomplete.component';
import { PermissionService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PermissionsComponent,
    PermissionComponent,
    PermissionEditComponent,
    PermissionAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // PermissionRoutingModule,
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
    PermissionService,
    ConfirmationService
  ]
})
export class PermissionModule {}
