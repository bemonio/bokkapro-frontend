import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrewService as ModelService } from '../_services/crew.service';
import { CrewModel as Model } from '../_models/crew.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
    selector: 'app-crews',
    templateUrl: './crews.component.html',
    styleUrls: ['./crews.component.scss']
})
export class CrewsComponent implements OnInit {

    public promiseForm: Promise<any>;

    public models: Model[];
    public modelsCalendar: Model[];
    public selectedModels: Model[];
    public selectedModelId: string;

    public page: number;
    public total_page: number;
    public per_page: number;
    public totalRecords: number;

    public sort: string;
    public query: string;
    public filters: { key: string, value: string }[];
    public _with: { key: string, value: string }[];

    // public formGroup: FormGroup;
    // public employee_id_filter: AbstractControl;
    // public department_id_filter: AbstractControl;
    // public venue_id_filter: AbstractControl;

    searchGroup: FormGroup;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public divisionId: number;
    public parent: string;

    public events: any[];
    public calendarOptions: CalendarOptions;
    public calendarStart: string;
    public calendarEnd: string;
    public filtersCalendar: {key: string, value: string}[];
    public dateSchedule: Date;

    public viewcalendar: boolean;
    public viewlist: boolean;

    public viewtypecalendar: string;

    public showViewTourDetail: boolean;

    constructor(
        public modelsService: ModelService,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        fb: FormBuilder) {
        // this.formGroup = fb.group({
        //     'employee_id_filter': [''],
        //     'department_id_filter': [''],
        //     'venue_id_filter': [''],
        // });
        // this.employee_id_filter = this.formGroup.controls['employee_id_filter'];
        // this.department_id_filter = this.formGroup.controls['department_id_filter'];
        // this.venue_id_filter = this.formGroup.controls['venue_id_filter'];

        this.searchGroup = fb.group({
            searchTerm: [''],
        });

        this.translate.get('COMMON.MESSAGE_CONFIRM_DELETE').subscribe((res: string) => {
            this.message_confirm_delete = res;
        });

        this.showTableCheckbox = false;
        this.parent = '';

        this.page = 1;
        this.total_page = 0;
        this.per_page = 100
        this.totalRecords = 0;

        this.requesting = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.modelsCalendar = [];
        this.selectedModels = [];

        this.viewlist = true;
        this.viewcalendar = false;

        this.showViewTourDetail = false;

        // this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.calendarOptions = {
            initialView: 'timeGridDay',
            eventClick: (e) => {
                this.showViewTourDetail = true;
                this.selectedModelId = e.event.id;
                this.router.navigate([this.parent + '/crews/edit/' + e.event.id]);
            },
            headerToolbar: {
                left: 'prev,next,today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            buttonText: {
                today:    'Hoy',
                month:    'mes',
                week:     'semana',
                day:      'día',
                list:     'lista'
            },
            allDayText: 'Todo el día',
            dateClick: this.handleDateClick.bind(this),
            datesSet: this.loadLazyCalendar.bind(this),
            editable: false,
            selectable:false,
            selectMirror: true,
            dayMaxEvents: true,
            locale: 'es',
            themeSystem: 'bootstrap'
        }
    }

    handleDateClick(arg) {
        console.log('date click! ' + arg.dateStr)
    }

    public loadLazyCalendar(dateInfo) {
        this.filtersCalendar = [];
        this.calendarStart = dateInfo.startStr;
        this.calendarEnd = dateInfo.endStr;
        this.filtersCalendar.push({'key': 'start-min', 'value': this.calendarStart});
        this.filtersCalendar.push({'key': 'end-max', 'value': this.calendarEnd});
        this.viewtypecalendar = dateInfo.view.type;
        if (this.viewtypecalendar==='timeGridDay') {
            this.dateSchedule = new Date(dateInfo.startStr);
        }
        this.getModelsCalendar();
    }

    public loadLazy(event?: LazyLoadEvent) {
        if (event && event.first) {
            this.page = (event.first / this.per_page) + 1;
        }

        if (event && event.sortField) {
            if (event.sortOrder === -1) {
                this.sort = '-' + event.sortField;
            } else {
                this.sort = event.sortField;
            }
        } else {
            this.sort = '-id';
        }

        if (event && event.globalFilter) {
            this.query = event.globalFilter;
        } else {
            this.query = undefined;
        }

        if (event && event.rows) {
            this.per_page = event.rows;
        }

        this.filters = [];
        if (this.route.parent.parent.parent.snapshot.url.length > 0) {
            this.route.parent.parent.parent.params.subscribe((params) => {
                if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                    this.divisionId = params.id;
                    this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.divisionId;
                    this.filters.push({ key: 'filter{division}', value: this.divisionId.toString() })
                }
                this.getModels();
            });
        } else {
            this.getModels();
        }
    }

    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).toPromise().then(
            response => {
                this.models = response.crews;
                this.totalRecords = response.meta.total_results;
                if(response.divisions){
                    response.divisions.forEach(division => {
                        this.models.forEach(element => {
                            if (element.division === division.id) {
                                element.division = division;
                            }
                        });
                    });
                }
                if(response.employees){
                    response.employees.forEach(employee => {
                        this.models.forEach(element => {
                            if (element.driver === employee.id) {
                                element.driver = employee;
                            }
                            if (element.assistant === employee.id) {
                                element.assistant = employee;
                            }
                            if (element.assistant2 === employee.id) {
                                element.assistant2 = employee;
                            }
                        });
                    });
                }
                if(response.vehicles){
                    response.vehicles.forEach(vehicle => {
                        this.models.forEach(element => {
                            if (element.vehicle === vehicle.id) {
                                element.vehicle = vehicle;
                            }
                        });
                    });
                }

                this.events = [];
                this.models.forEach(element => {
                    this.events.push({
                        "id": element.id,
                        "title": element.division.name,
                        "start": element.date
                    });
                });            
                this.requesting = false;
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
        }, 5)
    }

    public getModelsCalendar() {
        this.requesting = true;
        setTimeout(() => {
        let page = undefined; 
        let per_page = 10000000; 
        let sort = undefined; 
        let query = undefined; 
        let filters = this.filtersCalendar; 
        let _with = [];

        this.modelsService.get(page, per_page, sort, query, filters, _with).toPromise().then(
            response => {
                this.modelsCalendar = response.crews;
                this.totalRecords = response.meta.total_results;
                if(response.divisions){
                    response.divisions.forEach(division => {
                        this.modelsCalendar.forEach(element => {
                            if (element.division === division.id) {
                                element.division = division;
                            }
                        });
                    });
                }
                if(response.employees){
                    response.employees.forEach(employee => {
                        this.modelsCalendar.forEach(element => {
                            if (element.driver === employee.id) {
                                element.driver = employee;
                            }
                            if (element.assistant === employee.id) {
                                element.assistant = employee;
                            }
                            if (element.assistant2 === employee.id) {
                                element.assistant2 = employee;
                            }
                        });
                    });
                }
                if(response.vehicles){
                    response.vehicles.forEach(vehicle => {
                        this.modelsCalendar.forEach(element => {
                            if (element.vehicle === vehicle.id) {
                                element.vehicle = vehicle;
                            }
                        });
                    });
                }

                this.events = [];
                this.modelsCalendar.forEach(element => {
                    this.events.push({
                        "id": element.id,
                        "title": element.division.name,
                        "start": element.date
                    });
                });            
                this.calendarOptions.events = this.events;
                this.requesting = false;
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
        }, 5)
    }

    // public showDeleteDialog(crew: Model) {
    //     let message;
    //     this.translate.get('Do you want to delete?').subscribe((res: string) => {
    //         message = res;
    //     });

    //     let header;
    //     this.translate.get('Delete Confirmation').subscribe((res: string) => {
    //         header = res;
    //     });

    //     this.confirmationService.confirm({
    //         message: message,
    //         header: header,
    //         icon: 'fa fa-trash',
    //         accept: () => {
    //             this.delete(crew);
    //         }
    //     });
    // }

    public delete(id) {
        this.modelsService.delete(id).toPromise().then(
            response => {
                this.toastService.growl('success', 'Delete');
                this.getModels();
            },
            error => {
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
    }

    public patch(values: Model) {
        const param = {
            // 'activated': values.activated
        };
        if (values) {
            const promise = this.modelsService.patch(values.id, param);
            this.promiseForm = promise.toPromise().then(
                response => {
                    this.toastService.growl('success', 'Patch');
                },
                error => {
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
        }
    }

    confirm(id, position: string) {
        this.confirmDialogPosition = position;
        this.confirmationService.confirm({
            message: this.message_confirm_delete,
            accept: () => {
                this.delete(id);
            }
        });
    }

    public showList() {
        this.viewlist = true;
        this.viewcalendar = false;
    }

    public showCalendar() {
        this.viewlist = false;
        this.viewcalendar = true;
    }

    hideModal() {
        this.getModelsCalendar();
        this.showViewTourDetail = false;
    }
}
