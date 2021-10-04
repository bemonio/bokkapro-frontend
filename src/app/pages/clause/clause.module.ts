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
import { ClausesComponent } from './clauses/clauses.component';
import { ClauseComponent } from './clause.component';
// import { ClauseRoutingModule} from './clause-routing.module';
import { ClauseEditComponent } from './clauses/clause-edit/clause-edit.component';
import { ClauseAutocompleteComponent } from './clauses/clause-autocomplete/clause-autocomplete.component';
import { ClauseService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ClausesComponent,
    ClauseComponent,
    ClauseEditComponent,
    ClauseAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // ClauseRoutingModule,
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
    ClauseService,
    ConfirmationService
  ]
})
export class ClauseModule {}
