import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { PackagesComponent } from './packages/packages.component';
import { PackageComponent } from './package.component';
// import { PackageRoutingModule} from './package-routing.module';
import { PackageEditComponent } from './packages/package-edit/package-edit.component';
import { PackageAutocompleteComponent } from './packages/package-autocomplete/package-autocomplete.component';
import { PackageService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PackagesComponent,
    PackageComponent,
    PackageEditComponent,
    PackageAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // PackageRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    FileUploadModule,
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    PackageService,
    ConfirmationService
  ]
})
export class PackageModule {}
