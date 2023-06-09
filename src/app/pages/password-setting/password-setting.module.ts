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
import { PasswordsSettingsComponent } from './passwords-settings/passwords-settings.component';
import { PasswordSettingComponent } from './password-setting.component';
// import { PasswordSettingRoutingModule} from './password-setting-routing.module';
import { PasswordSettingEditComponent } from './passwords-settings/password-setting-edit/password-setting-edit.component';
import { PasswordSettingAutocompleteComponent } from './passwords-settings/password-setting-autocomplete/password-setting-autocomplete.component';
import { PasswordSettingService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PasswordsSettingsComponent,
    PasswordSettingComponent,
    PasswordSettingEditComponent,
    PasswordSettingAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    // PasswordSettingRoutingModule,
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
    PasswordSettingService,
    ConfirmationService
  ]
})
export class PasswordSettingModule {}
