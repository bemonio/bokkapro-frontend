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
import { GuidesComponent } from './guides/guides.component';
import { GuideComponent } from './guide.component';
// import { GuideRoutingModule} from './guide-routing.module';
import { GuideEditComponent } from './guides/guide-edit/guide-edit.component';
import { GuideAutocompleteComponent } from './guides/guide-autocomplete/guide-autocomplete.component';
import { GuideService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GuidesComponent,
    GuideComponent,
    GuideEditComponent,
    GuideAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // GuideRoutingModule,
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
    GuideService,
    ConfirmationService
  ]
})
export class GuideModule {}
