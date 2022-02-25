import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourDetailService as ModelService } from '../_services/tour-detail.service';
import { TourDetailModel as Model } from '../_models/tour-detail.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { CalendarOptions } from '@fullcalendar/angular';
import { OriginDestinationService } from '../../origin-destination/_services';
import { OriginDestinationModel } from '../../origin-destination/_models/origin-destination.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-tours-details',
    templateUrl: './tours-details.component.html',
    styleUrls: ['./tours-details.component.scss']
})
export class ToursDetailsComponent implements OnInit {

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

    public formGroup: FormGroup;
    public division: AbstractControl;

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
    public listOriginDestinationSelectedModels: OriginDestinationModel[];

    public viewcalendar: boolean;
    public viewlist: boolean;

    public viewtypecalendar: string;

    public showViewTourDetail: boolean;

    public visibleSidebar;

    constructor(
        public modelsService: ModelService,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        public originDestinationsService: OriginDestinationService,
        fb: FormBuilder) {
        this.formGroup = fb.group({
            'division': ['', Validators.compose([Validators.required,])],
        });
        this.division = this.formGroup.controls['division'];

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
        this.listOriginDestinationSelectedModels = [];

        this.viewlist = false;
        this.viewcalendar = true;

        this.showViewTourDetail = false;
        // this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.visibleSidebar = false;

        this.calendarOptions = {
            initialView: 'timeGridDay',
            eventClick: (e) => {
                this.showViewTourDetail = true;
                this.selectedModelId = e.event.id;
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
        this.getModelsCalendar();
    }

    public handleDateClick(arg) {
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
        if (event && (event.first || event.first == 0)) {
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
                this.models = response.tours;
                this.totalRecords = response.meta.total_results;
                if(response.origindestinations){
                    response.origindestinations.forEach(origindestination => {
                        this.models.forEach(element => {
                            if (element.origin_destination === origindestination.id) {
                                element.origin_destination = origindestination;
                            }
                        });
                    });
                }
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
                    ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
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
                this.modelsCalendar = response.tour_details;
                this.totalRecords = response.meta.total_results;
                if(response.origin_destinations){
                    response.origin_destinations.forEach(origin_destination => {
                        this.modelsCalendar.forEach(element => {
                            if (element.origin_destination === origin_destination.id) {
                                element.origin_destination = origin_destination;
                            }
                            if (element.origin_destination.origin) {
                                response.locations.forEach(location => {
                                    if (element.origin_destination.origin === location.id) {
                                        element.origin_destination.origin = location;
                                    }
                                });
                            }
                            if (element.origin_destination.destination) {
                                response.locations.forEach(location => {
                                    if (element.origin_destination.destination === location.id) {
                                        element.origin_destination.destination = location;
                                    }
                                });
                            }
                            if (element.division) {
                                response.divisions.forEach(division => {
                                    if (element.division === division.id) {
                                        element.division = division;
                                    }
                                });
                            }
                        });
                    });
                }

                this.events = [];
                this.modelsCalendar.forEach(element => {
                    let origin_name = 'N/A';
                    let destination_name = 'N/A';
                    let division_name = 'N/A';
                    if (element.origin_destination && element.origin_destination.origin){
                        origin_name = element.origin_destination.origin.name;
                    }
                    if (element.origin_destination  && element.origin_destination.destination){
                        destination_name = element.origin_destination.destination.name;
                    }
                    if (element.division){
                        division_name = element.division.name;
                    }

                    this.events.push({
                        "id": element.id,
                        "title": origin_name + ' - ' + destination_name + ' [' + division_name + ']',
                        "start": element.date_start,
                        "end": element.date_end,
                        "origin_destination": element.origin_destination.id,
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
                    ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
                );
            }
        );
        }, 5)
    }

    // public showDeleteDialog(tour: Model) {
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
    //             this.delete(tour);
    //         }
    //     });
    // }

    public delete(id) {
        this.modelsService.delete(id).toPromise().then(
            response => {
                this.toastService.growl('top-right', 'success', 'Delete');
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
                    ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
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
                    this.toastService.growl('top-right', 'success', 'Patch');
                },
                error => {
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

    public addSelectedOriginDestination() {
        let page = 1;
        let per_page = 10000000;
        let sort = "-id"
        let query = undefined;
        let filters = [];
        let _with = [];
        _with.push({key: 'include[]', value: 'origin.*'})
        _with.push({key: 'include[]', value: 'destination.*'})
        _with.push({key: 'include[]', value: 'service_order.*'})

        let events = this.listOriginDestinationSelectedModels;
        let copyEvents = this.events;
        this.events = [];
        let start_time = undefined;
        let end_time = undefined;

        let found = false;

        let date = this.dateSchedule ? this.dateSchedule : new Date();
        events.forEach(element => {
            switch (date.getDay()) {
                case 0:
                    start_time = element.sunday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.sunday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.sunday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.sunday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;                                
                case 1:
                    start_time = element.monday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.monday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.monday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.monday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;
                case 2:
                    start_time = element.tuesday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.tuesday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.tuesday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.tuesday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;
                case 3:
                    start_time = element.wednesday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.wednesday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.wednesday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.wednesday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;
                case 4:
                    start_time = element.thursday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.thursday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.thursday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.thursday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;
                case 5:
                    start_time = element.friday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.friday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.friday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.friday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;
                case 6:
                    start_time = element.saturday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.saturday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                    end_time = element.saturday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.saturday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                    break;
            }
            let division;
            if (element.division && element.division.id) {
                division = element.division.id;
            }
            if (this.division.value && this.division.value.id) {
                division = this.division.value.id;
            }

            let origin_name;
            if (element.origin && element.origin.id) {
                origin_name = element.origin.name;
            }

            let destination_name;
            if (element.destination && element.destination.id) {
                destination_name = element.destination.name;
            }

            let foundAux = false;
            copyEvents.forEach(event => {
                if (element.id == event.origin_destination && date.toISOString().split('T')[0] == event.start.split('T')[0]) {
                    foundAux = true;
                    found = true;
                }
            });
            if (!foundAux) {
                this.events.push({
                    "id": element.id,
                    "title": origin_name + ' - ' + destination_name,
                    "start": start_time,
                    "end": end_time,
                    "division": division,
                });
            }
        });

        if (found) {
            this.toastService.growl('top-right', 'info', 'Uno o más Recorrido(s) Existente(s)') 
        }
        // this.calendarOptions.events = this.events;
        this.createTourDetail(this.events);
    }

    public addAllOriginDestination() {
        let page = 1;
        let per_page = 10000000;
        let sort = "-id"
        let query = undefined;
        let filters = [];
        let _with = [];
        _with.push({key: 'include[]', value: 'origin.*'})
        _with.push({key: 'include[]', value: 'destination.*'})
        _with.push({key: 'include[]', value: 'service_order.*'})
        _with.push({key: 'include[]', value: 'division.*'})

        let copyEvents = this.events;
        let found = false;

        let date = this.dateSchedule ? this.dateSchedule : new Date();
        switch (date.getDay()) {
            case 0:
                filters.push({ key: 'filter{sunday}', value: 'true' })
                break;                                
            case 1:
                filters.push({ key: 'filter{monday}', value: 'true' })
                break;
            case 2:
                filters.push({ key: 'filter{tuesday}', value: 'true' })
                break;
            case 3:
                filters.push({ key: 'filter{wednesday}', value: 'true' })
                break;
            case 4:
                filters.push({ key: 'filter{thursday}', value: 'true' })
                break;
            case 5:
                filters.push({ key: 'filter{friday}', value: 'true' })
                break;
            case 6:
                filters.push({ key: 'filter{saturday}', value: 'true' })
                break;
        }

        this.requesting = true;
        setTimeout(() => {
        this.originDestinationsService.get(page, per_page, sort, query, filters, _with).subscribe(
            response => {
                this.requesting = false;
                let events = response.origin_destinations;
                this.totalRecords = response.meta.total_results;
                if(response.locations){
                    response.locations.forEach(origin => {
                        events.forEach(element => {
                            if (element.origin === origin.id) {
                                element.origin = origin;
                            }
                        });
                    });
                }
                if(response.locations){
                    response.locations.forEach(destination => {
                        events.forEach(element => {
                            if (element.destination === destination.id) {
                                element.destination = destination;
                            }
                        });
                    });
                }
                if(response.service_orders){
                    response.service_orders.forEach(service_order => {
                        events.forEach(element => {
                            if (element.service_order === service_order.id) {
                                element.service_order = service_order;
                            }
                        });
                    });
                }
                this.events = [];
                let start_time = undefined;
                let end_time = undefined;

                events.forEach(element => {
                    switch (date.getDay()) {
                        case 0:
                            start_time = element.sunday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.sunday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.sunday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.sunday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;                                
                        case 1:
                            start_time = element.monday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.monday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.monday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.monday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 2:
                            start_time = element.tuesday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.tuesday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.tuesday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.tuesday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 3:
                            start_time = element.wednesday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.wednesday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.wednesday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.wednesday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 4:
                            start_time = element.thursday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.thursday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.thursday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.thursday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 5:
                            start_time = element.friday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.friday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.friday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.friday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 6:
                            start_time = element.saturday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.saturday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.saturday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.saturday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                    }
                    let division;
                    if (element.division && element.division.id) {
                        division = element.division.id;
                    }
                    if (this.division.value && this.division.value.id) {
                        division = this.division.value.id;
                    }
        
                    let origin_name;
                    if (element.origin && element.origin.id) {
                        origin_name = element.origin.name;
                    }
        
                    let destination_name;
                    if (element.destination && element.destination.id) {
                        destination_name = element.destination.name;
                    }
        
                    this.events.push({
                        "id": element.id,
                        "title": origin_name + ' - ' + destination_name,
                        "start": start_time,
                        "end": end_time,
                        "division": division
                    });

                    let foundAux = false;
                    copyEvents.forEach(event => {
                        if (element.id == event.origin_destination && date.toISOString().split('T')[0] == event.start.split('T')[0]) {
                            foundAux = true;
                            found = true;
                        }
                    });
                    if (!foundAux) {
                        this.events.push({
                            "id": element.id,
                            "title": origin_name + ' - ' + destination_name,
                            "start": start_time,
                            "end": end_time,
                            "division": division,
                        });
                    }
                });
                if (found) {
                    this.toastService.growl('top-right', 'info', 'Uno o más Recorrido(s) Existente(s)') 
                }
            
                // this.calendarOptions.events = this.events;
                this.createTourDetail(this.events);
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
        }, 5)
    }

    public addNotPrecallOriginDestination() {
        let page = 1;
        let per_page = 10000000;
        let sort = "-id"
        let query = undefined;
        let filters = [];
        let _with = [];
        _with.push({key: 'include[]', value: 'origin.*'})
        _with.push({key: 'include[]', value: 'destination.*'})
        _with.push({key: 'include[]', value: 'service_order.*'})
        _with.push({key: 'include[]', value: 'division.*'})

        filters.push({ key: 'filter{precall}', value: 'false' })

        let copyEvents = this.events;
        let found = false;

        let date = this.dateSchedule ? this.dateSchedule : new Date();
        switch (date.getDay()) {
            case 0:
                filters.push({ key: 'filter{sunday}', value: 'true' })
                break;                                
            case 1:
                filters.push({ key: 'filter{monday}', value: 'true' })
                break;
            case 2:
                filters.push({ key: 'filter{tuesday}', value: 'true' })
                break;
            case 3:
                filters.push({ key: 'filter{wednesday}', value: 'true' })
                break;
            case 4:
                filters.push({ key: 'filter{thursday}', value: 'true' })
                break;
            case 5:
                filters.push({ key: 'filter{friday}', value: 'true' })
                break;
            case 6:
                filters.push({ key: 'filter{saturday}', value: 'true' })
                break;
        }

        this.requesting = true;
        setTimeout(() => {
        this.originDestinationsService.get(page, per_page, sort, query, filters, _with).subscribe(
            response => {
                this.requesting = false;
                let events = response.origin_destinations;
                this.totalRecords = response.meta.total_results;
                if(response.locations){
                    response.locations.forEach(origin => {
                        events.forEach(element => {
                            if (element.origin === origin.id) {
                                element.origin = origin;
                            }
                        });
                    });
                }
                if(response.locations){
                    response.locations.forEach(destination => {
                        events.forEach(element => {
                            if (element.destination === destination.id) {
                                element.destination = destination;
                            }
                        });
                    });
                }
                if(response.service_orders){
                    response.service_orders.forEach(service_order => {
                        events.forEach(element => {
                            if (element.service_order === service_order.id) {
                                element.service_order = service_order;
                            }
                        });
                    });
                }
                this.events = [];
                let start_time = undefined;
                let end_time = undefined;

                events.forEach(element => {
                    switch (date.getDay()) {
                        case 0:
                            start_time = element.sunday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.sunday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.sunday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.sunday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;                                
                        case 1:
                            start_time = element.monday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.monday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.monday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.monday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 2:
                            start_time = element.tuesday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.tuesday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.tuesday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.tuesday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 3:
                            start_time = element.wednesday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.wednesday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.wednesday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.wednesday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 4:
                            start_time = element.thursday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.thursday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.thursday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.thursday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 5:
                            start_time = element.friday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.friday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.friday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.friday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                        case 6:
                            start_time = element.saturday_start_time_tour ? date.toISOString().split('T')[0] + ' ' + element.saturday_start_time_tour + '' : date.toISOString().split('T')[0] + ' 00:00:00';
                            end_time = element.saturday_end_time_tour ? date.toISOString().split('T')[0] + ' ' + element.saturday_end_time_tour + '' : date.toISOString().split('T')[0] + 'T01:00:00';
                            break;
                    }
                    let division;
                    if (element.division && element.division.id) {
                        division = element.division.id;
                    }
                    if (this.division.value && this.division.value.id) {
                        division = this.division.value.id;
                    }
        
                    let origin_name;
                    if (element.origin && element.origin.id) {
                        origin_name = element.origin.name;
                    }
        
                    let destination_name;
                    if (element.destination && element.destination.id) {
                        destination_name = element.destination.name;
                    }
        
                    this.events.push({
                        "id": element.id,
                        "title": origin_name + ' - ' + destination_name,
                        "start": start_time,
                        "end": end_time,
                        "division": division
                    });
                    let foundAux = false;
                    copyEvents.forEach(event => {
                        if (element.id == event.origin_destination && date.toISOString().split('T')[0] == event.start.split('T')[0]) {
                            foundAux = true;
                            found = true;
                        }
                    });
                    if (!foundAux) {
                        this.events.push({
                            "id": element.id,
                            "title": origin_name + ' - ' + destination_name,
                            "start": start_time,
                            "end": end_time,
                            "division": division,
                        });
                    }
                });
                if (found) {
                    this.toastService.growl('top-right', 'info', 'Uno o más Recorrido(s) Existente(s)') 
                }

                // this.calendarOptions.events = this.events;
                this.createTourDetail(this.events);
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
        }, 5)
    }    

    createTourDetail(listModel) {
        this.requesting = true;
        
        const sbCreate = this.modelsService.postList(listModel).pipe(
          tap(() => {
            this.toastService.growl('top-right', 'success', 'success');
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
            return of(this.models);
          })
        ).subscribe(response => {
            this.requesting = false;
            this.visibleSidebar = false;
            this.getModelsCalendar();
        });
        // this.subscriptions.push(sbCreate);
    }

    hideModal() {
        this.getModelsCalendar();
        this.showViewTourDetail = false;
        this.selectedModelId = undefined;
    }

    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation: string, controlName: string) {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty || control.touched;
    }

    public showListOriginDestination() {
        this.formGroup.reset();
        this.listOriginDestinationSelectedModels = [];
        this.visibleSidebar = true;
    }

    public printReport() {
        let url = environment.apiUrl + 'pdf/toursdetails?start=' + this.calendarStart + '&end=' + this.calendarEnd;
        window.open(url, '_blank');
    }
}
