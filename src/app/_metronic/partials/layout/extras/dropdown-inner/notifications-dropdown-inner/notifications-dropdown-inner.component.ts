import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { LazyLoadEvent } from 'primeng/api';
import { NotificationService } from 'src/app/pages/notification/_services';
import { NotificationModel as Model } from 'src/app/pages/notification/_models/notification.model';
import { AuthService } from 'src/app/modules/auth';

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

  constructor(
    private layout: LayoutService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    public authService: AuthService,
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
    if (event) {
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

    this.getModels();
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
            if(this.totalRecords != response.meta.total_results){
              this.whichTotalRecords.emit(response.meta.total_results);
            }
            this.totalRecords = response.meta.total_results;
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
                ([key, value]) => this.toastService.growl('error', key + ': ' + value)
            );
        }
    );
    }, 0)
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
