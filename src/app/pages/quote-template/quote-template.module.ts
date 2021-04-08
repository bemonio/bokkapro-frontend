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
import { QuoteTemplatesComponent } from './quote-templates/quote-templates.component';
import { QuoteTemplateComponent } from './quote-template.component';
// import { QuoteTemplateRoutingModule} from './quote-template-routing.module';
import { QuoteTemplateEditComponent } from './quote-templates/quote-template-edit/quote-template-edit.component';
import { QuoteTemplateService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    QuoteTemplatesComponent,
    QuoteTemplateComponent,
    QuoteTemplateEditComponent,
  ],
  imports: [
    CommonModule,
    // QuoteTemplateRoutingModule,
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
    QuoteTemplateService,
    ConfirmationService
  ]
})
export class QuoteTemplateModule {}
