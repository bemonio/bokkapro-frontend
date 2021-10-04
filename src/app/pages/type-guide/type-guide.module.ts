import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TypesGuidesComponent } from './types-guides/types-guides.component';
import { TypeGuideComponent } from './type-guide.component';
// import { TypeGuideRoutingModule} from './type-guide-routing.module';
import { TypeGuideEditComponent } from './types-guides/type-guide-edit/type-guide-edit.component';
import { TypeGuideAutocompleteComponent } from './types-guides/type-guide-autocomplete/type-guide-autocomplete.component';
import { TypeGuideService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesGuidesComponent,
    TypeGuideComponent,
    TypeGuideEditComponent,
    TypeGuideAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // TypeGuideRoutingModule,
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
    RouterModule
  ],
  entryComponents: [
  ],
  providers: [
    TypeGuideService,
    ConfirmationService
  ]
})
export class TypeGuideModule {}
