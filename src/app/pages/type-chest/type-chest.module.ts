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
import { TypesChestsComponent } from './types-chests/types-chests.component';
import { TypeChestComponent } from './type-chest.component';
// import { TypeChestRoutingModule} from './type-chest-routing.module';
import { TypeChestEditComponent } from './types-chests/type-chest-edit/type-chest-edit.component';
import { TypeChestService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TypesChestsComponent,
    TypeChestComponent,
    TypeChestEditComponent,
  ],
  imports: [
    CommonModule,
    // TypeChestRoutingModule,
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
    TypeChestService,
    ConfirmationService
  ]
})
export class TypeChestModule {}
