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
import { ClientBinnaclesComponent } from './client-binnacles/client-binnacles.component';
import { ClientBinnacleComponent } from './client-binnacle.component';
// import { ClientBinnacleRoutingModule} from './client-binnacle-routing.module';
import { ClientBinnacleEditComponent } from './client-binnacles/client-binnacle-edit/client-binnacle-edit.component';
import { ClientBinnacleService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ClientBinnaclesComponent,
    ClientBinnacleComponent,
    ClientBinnacleEditComponent,
  ],
  imports: [
    CommonModule,
    // ClientBinnacleRoutingModule,
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
    ClientBinnacleService,
    ConfirmationService
  ]
})
export class ClientBinnacleModule {}
