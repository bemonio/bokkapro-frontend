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
import { RatesComponent } from './rates/rates.component';
import { RateComponent } from './rate.component';
// import { RateRoutingModule} from './rate-routing.module';
import { RateEditComponent } from './rates/rate-edit/rate-edit.component';
import { RateAutocompleteComponent } from './rates/rate-autocomplete/rate-autocomplete.component';
import { RateService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RatesComponent,
    RateComponent,
    RateEditComponent,
    RateAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // RateRoutingModule,
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
    RateService,
    ConfirmationService
  ]
})
export class RateModule {}
