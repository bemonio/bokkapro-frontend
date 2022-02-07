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
import { ProductPartsComponent } from './product-parts/product-parts.component';
import { ProductPartComponent } from './product-part.component';
// import { ProductPartRoutingModule} from './product-part-routing.module';
import { ProductPartEditComponent } from './product-parts/product-part-edit/product-part-edit.component';
import { ProductPartService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProductPartsComponent,
    ProductPartComponent,
    ProductPartEditComponent,
  ],
  imports: [
    CommonModule,
    // ProductPartRoutingModule,
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
    ProductPartService,
    ConfirmationService
  ]
})
export class ProductPartModule {}
