import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { LazyLoadEvent } from 'primeng/api';
import { NotificationService } from 'src/app/pages/notification/_services';
import { NotificationModel as Model } from 'src/app/pages/notification/_models/notification.model';
import { AuthService } from 'src/app/modules/auth';

import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Observable, of, Subscription } from 'rxjs';
import { PasswordSettingModel as PasswordSettingModel } from '../../../../../../pages/password-setting/_models/password-setting.model';
import { PasswordSettingService as PasswordSettingService } from '../../../../../../pages/password-setting/_services/password-setting.service';

@Component({
  selector: 'app-notifications-dropdown-inner',
  templateUrl: './notifications-dropdown-inner.component.html',
  styleUrls: ['./notifications-dropdown-inner.component.scss'],
})
export class NotificationsDropdownInnerComponent implements OnInit, OnChanges {
  @Output() whichTotalRecords = new EventEmitter<number>();

  extrasNotificationsDropdownStyle: 'light' | 'dark' = 'dark';
  activeTabId:
    | 'topbar_notifications_notifications'
    | 'topbar_notifications_events'
    | 'topbar_notifications_logs' = 'topbar_notifications_notifications';
  
  public requesting: boolean = false;
  public models: Model[];
  public totalRecords: number;
  public filters: { key: string, value: string }[];
  public showMessageNoNotification: boolean;
  public showMessageNoEvent: boolean;
  public showMessageNoAlert: boolean;

  public password_setting: PasswordSettingModel;

  private subscriptions: Subscription[] = [];

  constructor(
    private layout: LayoutService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private passwordSettingService: PasswordSettingService
  ) {

    this.requesting = false;
    this.models = [];
    this.totalRecords = 0;
    this.filters = [];
    this.showMessageNoNotification = true;
    this.showMessageNoEvent = true;
    this.showMessageNoAlert = true;
    this.loadLazy();
  }

  ngOnInit(): void {
    this.extrasNotificationsDropdownStyle = this.layout.getProp(
      'extras.notifications.dropdown.style'
    );
    setInterval(() => this.loadLazy(),300000);
  }

  ngOnChanges(): void {
  }

  public loadLazy(event?: LazyLoadEvent) {
    if (event && event.first) {
    }

    this.filters = [];
    this.filters.push({ key: 'filter{employee_destination}', value: this.authService.currentUserValue.employee.id })

    // switch (this.activeTabId) {
    //   case 'topbar_notifications_notifications':
    //     this.filters.push({ key: 'filter{type}[]', value: 'Notificación'})
    //     break;
    //   case 'topbar_notifications_events':
    //     this.filters.push({ key: 'filter{type}[]', value: 'Evento'})
    //     break;
    //   case 'topbar_notifications_logs':
    //     this.filters.push({ key: 'filter{type}[]', value: 'Alerta'})
    //     break;
    //   default:
    //     break;
    // }

    this.get_password_settings();
  }

  public getModels() {
    this.requesting = true;
    setTimeout(() => {
    this.notificationService.get(undefined, undefined, undefined, undefined, this.filters, undefined).subscribe(
        response => {
            this.requesting = false;
            this.models = [];
            response.notifications.forEach(element => {
                this.models.push(element);
            });
            let n = 0;
            const currentDate = new Date();
            const passwordChangedDate = new Date(this.authService.currentUserValue.user_profiles.password_changed_at);
            const timeDiff = currentDate.getTime() - passwordChangedDate.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff > (this.password_setting.password_change_frequency_days - this.password_setting.password_expiry_notification_days)) {
              n = 1;
              const diasRestantes = this.password_setting.password_change_frequency_days - daysDiff;
              this.models.push(
                {
                  "id": 0,
                  "employee_origin": 1,
                  "employee_destination": 1,
                  "icon": "red",
                  "title": "Cambio de Clave Requerido",
                  "description": "Días restantes " + diasRestantes,
                  "link": "passwordsettings",
                  "is_read": false,
                  "type": "Notificación",
                  "module": "PasswordSettings",
                  "created_at": "2023-06-07T00:16:17.513263",
                  "updated_at": "2023-06-07T00:18:39.259147"
                }
              )    
            }
            this.models.some(element => {
              element.type === 'Notificación' 
              ? this.showMessageNoNotification = false 
              : this.showMessageNoNotification = true ;
              return element.type === 'Notificación';
            });
            this.models.some(element => {
              element.type === 'Evento' 
              ? this.showMessageNoEvent = false 
              : this.showMessageNoEvent = true ;
              return element.type === 'Evento';
            });
            this.models.some(element => {
              element.type === 'Alerta' 
              ? this.showMessageNoAlert = false 
              : this.showMessageNoAlert = true ;
              return element.type === 'Alerta';
            });
            if(this.totalRecords != response.meta.total_results + n){
              this.whichTotalRecords.emit(response.meta.total_results + n);
            }
            this.totalRecords = response.meta.total_results + n;
        },
        error => {
            this.requesting = false;
            let messageError = [];
            if (!Array.isArray(error.error)) {
                messageError.push(error.error);
            } else {
                messageError = error.error;
            }
            Object.entries(messageError).forEach(
                ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
            );
        }
    );
    }, 0)
  }

  get_password_settings() {
    this.requesting = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        return this.passwordSettingService.getById(1);
      }),
      catchError((error) => {
        this.requesting = false;
        let messageError = [];
        if (!Array.isArray(error.error)) {
          messageError.push(error.error);
        } else {
          messageError = error.error;
        }
        Object.entries(messageError).forEach(
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of({ 'password_settings': new PasswordSettingModel() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.password_setting = response.password_setting;
        this.getModels();
      }
    });
    this.subscriptions.push(sb);
  }
  setActiveTabId(tabId) {
    this.activeTabId = tabId;
    this.loadLazy();
  }

  getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return '';
    }
    return 'active show';
  }
}
