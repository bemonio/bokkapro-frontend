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
import { ModerationsComponent } from './moderations/moderations.component';
import { ModerationComponent } from './moderation.component';
// import { ModerationRoutingModule} from './moderation-routing.module';
import { ModerationEditComponent } from './moderations/moderation-edit/moderation-edit.component';
import { ModerationAutocompleteComponent } from './moderations/moderation-autocomplete/moderation-autocomplete.component';
import { ModerationService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ModerationsComponent,
    ModerationComponent,
    ModerationEditComponent,
    ModerationAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // ModerationRoutingModule,
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
    ModerationService,
    ConfirmationService
  ]
})
export class ModerationModule {}
