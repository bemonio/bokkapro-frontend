import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationComponent } from './notification.component';
// import { NotificationRoutingModule} from './notification-routing.module';
import { NotificationEditComponent } from './notifications/notification-edit/notification-edit.component';
import { NotificationService } from './_services/';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationComponent,
    NotificationEditComponent,
  ],
  imports: [
    CommonModule,
    // NotificationRoutingModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TranslateModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    FileUploadModule,
    RouterModule,
  ],
  entryComponents: [
  ],
  providers: [
    NotificationService,
    ConfirmationService
  ]
})
export class NotificationModule {}
