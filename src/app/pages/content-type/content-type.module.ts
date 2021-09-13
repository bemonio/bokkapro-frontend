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
import { ContentTypesComponent } from './content-types/content-types.component';
import { ContentTypeComponent } from './content-type.component';
// import { ContentTypeRoutingModule} from './content-type-routing.module';
import { ContentTypeEditComponent } from './content-types/content-type-edit/content-type-edit.component';
import { ContentTypeService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ContentTypesComponent,
    ContentTypeComponent,
    ContentTypeEditComponent,
  ],
  imports: [
    CommonModule,
    // ContentTypeRoutingModule,
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
    ContentTypeService,
    ConfirmationService
  ]
})
export class ContentTypeModule {}
