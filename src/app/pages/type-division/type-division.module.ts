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
import { TypesDivisionsComponent } from './types-divisions/types-divisions.component';
import { TypeDivisionComponent } from './type-division.component';
// import { TypeDivisionRoutingModule} from './type-division-routing.module';
import { TypeDivisionEditComponent } from './types-divisions/type-division-edit/type-division-edit.component';
import { TypeDivisionAutocompleteComponent } from './types-divisions/type-division-autocomplete/type-division-autocomplete.component';
import { TypeDivisionService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesDivisionsComponent,
    TypeDivisionComponent,
    TypeDivisionEditComponent,
    TypeDivisionAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // TypeDivisionRoutingModule,
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
    TypeDivisionService,
    ConfirmationService
  ]
})
export class TypeDivisionModule {}
