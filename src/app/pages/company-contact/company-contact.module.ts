import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { CompanyContactsComponent } from './company-contacts/company-contacts.component';
import { CompanyContactComponent } from './company-contact.component';
// import { CompanyContactRoutingModule} from './company-contact-routing.module';
import { CompanyContactEditComponent } from './company-contacts/company-contact-edit/company-contact-edit.component';
import { CompanyContactAutocompleteComponent } from './company-contacts/company-contact-autocomplete/company-contact-autocomplete.component';
import { CompanyContactService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CompanyContactsComponent,
    CompanyContactComponent,
    CompanyContactEditComponent,
    CompanyContactAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // CompanyContactRoutingModule,
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
    FileUploadModule,
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    CompanyContactService,
    ConfirmationService
  ]
})
export class CompanyContactModule {}
