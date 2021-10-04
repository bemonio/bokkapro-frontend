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
import { ContractsComponent } from './contracts/contracts.component';
import { ContractComponent } from './contract.component';
// import { ContractRoutingModule} from './contract-routing.module';
import { ContractEditComponent } from './contracts/contract-edit/contract-edit.component';
import { ContractAutocompleteComponent } from './contracts/contract-autocomplete/contract-autocomplete.component';
import { ContractService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ContractsComponent,
    ContractComponent,
    ContractEditComponent,
    ContractAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // ContractRoutingModule,
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
    ContractService,
    ConfirmationService
  ]
})
export class ContractModule {}
