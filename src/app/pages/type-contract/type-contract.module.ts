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
import { TypesContractsComponent } from './types-contracts/types-contracts.component';
import { TypeContractComponent } from './type-contract.component';
// import { TypeContractRoutingModule} from './type-contract-routing.module';
import { TypeContractEditComponent } from './types-contracts/type-contract-edit/type-contract-edit.component';
import { TypeContractService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesContractsComponent,
    TypeContractComponent,
    TypeContractEditComponent,
  ],
  imports: [
    CommonModule,
    // TypeContractRoutingModule,
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
    TypeContractService,
    ConfirmationService
  ]
})
export class TypeContractModule {}
