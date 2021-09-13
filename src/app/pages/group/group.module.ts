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
import { GroupsComponent } from './groups/groups.component';
import { GroupComponent } from './group.component';
// import { GroupRoutingModule} from './group-routing.module';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { GroupAutocompleteComponent } from './groups/group-autocomplete/group-autocomplete.component';
import { GroupService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupComponent,
    GroupEditComponent,
    GroupAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // GroupRoutingModule,
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
    GroupService,
    ConfirmationService
  ]
})
export class GroupModule {}
