import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OriginDestinationService as ModelService } from '../_services/origin-destination.service';
import { OriginDestinationModel as Model } from '../_models/origin-destination.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
@Component({
    selector: 'app-origin-destinations',
    templateUrl: './origin-destinations.component.html',
    styleUrls: ['./origin-destinations.component.scss']
})
export class OriginDestinationsComponent implements OnInit, OnChanges {
    @Input() serviceOrderId: any;
    @Input() showListSchedule: boolean;
    @Input() dateSchedule: Date;
    @Input()  selectedModels!: Model[] | Model[];
    @Output() selectedModelsChange = new EventEmitter<Model[]>();
 
    public promiseForm: Promise<any>;
 
    public models: Model[];
    // public selectedModels: Model[];
 
    public page: number;
    public total_page: number;
    public per_page: number;
    public totalRecords: number;
 
    public sort: string;
    public query: string;
    public filters: { key: string, value: string }[];
    public _with: { key: string, value: string }[];
 
    public formGroup: FormGroup;
 
    searchGroup: FormGroup;
    public precall_filter: boolean;
 
    public requesting: boolean = false;
 
    public confirmDialogPosition: string;
    public message_confirm_delete: string;
 
    public displayModal: boolean;
    public showTableCheckbox: boolean;
 
    public serOrderId: number;
    public parent: string;
    public originDestinationID: { id: number, isNew: boolean };
    public setViewOriginDestination: boolean;
 
    constructor(
        public modelsService: ModelService,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        public authService: AuthService,
        fb: FormBuilder) {
        this.formGroup = fb.group({
 
        });
 
        this.searchGroup = fb.group({
            searchTerm: [''],
        });
 
        this.translate.get('COMMON.MESSAGE_CONFIRM_DELETE').subscribe((res: string) => {
            this.message_confirm_delete = res;
        });
 
        this.showTableCheckbox = true;
        this.parent = '';
 
        this.precall_filter = false;
 
        this.page = 1;
        this.total_page = 0;
        this.per_page = 100
        this.totalRecords = 0;
 
        this.requesting = false;
        this.displayModal = false;
 
        this.confirmDialogPosition = 'right';
 
        this.models = [];
        this.selectedModels = [];
        this.getModels();
    }
 
    ngOnInit() {
        this.requesting = false;
        this.originDestinationID = {id: undefined, isNew: false};
        this._with = [];
        this._with.push({key: 'include[]', value: 'origin.*'})
        this._with.push({key: 'include[]', value: 'destination.*'})
        this._with.push({key: 'include[]', value: 'service_order.*'})
        this._with.push({key: 'include[]', value: 'service_order.contract.*'})
        this._with.push({key: 'include[]', value: 'division.*'})
 
        this.setViewOriginDestination = false;
    }
 
    ngOnChanges() {
        this.ngOnInit();
        this.loadLazy();
    }
 
    public loadLazy(event?: LazyLoadEvent) {
        if (event && event.first) {
            if (event && event.first) {
            this.page = (event.first / this.per_page) + 1;
            }
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
 
        if (this.showListSchedule) {
            let date = this.dateSchedule ? this.dateSchedule : new Date();
            switch (date.getDay()) {
                case 0:
                    this.filters.push({ key: 'filter{sunday}', value: 'true' })
                    break;                                
                case 1:
                    this.filters.push({ key: 'filter{monday}', value: 'true' })
                    break;
                case 2:
                    this.filters.push({ key: 'filter{tuesday}', value: 'true' })
                    break;
                case 3:
                    this.filters.push({ key: 'filter{wednesday}', value: 'true' })
                    break;
                case 4:
                    this.filters.push({ key: 'filter{thursday}', value: 'true' })
                    break;
                case 5:
                    this.filters.push({ key: 'filter{friday}', value: 'true' })
                    break;
                case 6:
                    this.filters.push({ key: 'filter{saturday}', value: 'true' })
                    break;
            }
        }
 
        if (this.serviceOrderId) {
            this.filters.push({ key: 'filter{service_order}', value: this.serviceOrderId.toString() })
            this.parent = '/' + this.route.parent.parent.snapshot.url[0].path + '/edit/' + this.serviceOrderId;
            this.getModels();
        } else {
            if (this.route.parent.parent.parent.snapshot.url.length > 0) {
                this.route.parent.parent.parent.params.subscribe((params) => {
                    if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                        this.serOrderId = params.id;
                        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.serOrderId;
                        this.filters.push({ key: 'filter{service_order}', value: this.serOrderId.toString() })
                    }
                    this.getModels();
                });
            } else {
                this.getModels();
            }  
        }
    }
 
    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.requesting = false;
                this.models = response.origin_destinations;
                this.totalRecords = response.meta.total_results;
                if(response.locations){
                    response.locations.forEach(origin => {
                        this.models.forEach(element => {
                            if (element.origin === origin.id) {
                                element.origin = origin;
                            }
                        });
                    });
                }
                if(response.service_orders){
                    response.service_orders.forEach(service_order => {
                        this.models.forEach(element => {
                            if (element.service_order === service_order.id) {
                                element.service_order = service_order;
                            }
                        });
                    });
                }
                if(response.contracts){
                    response.contracts.forEach(contract => {
                        this.models.forEach(element => {
                            if (element.service_order) {
                                if (element.service_order.contract === contract.id) {
                                    element.service_order.contract = contract;
                                }
                            }
                        });
                    });
                }
                if(response.divisions){
                    response.divisions.forEach(division => {
                        this.models.forEach(element => {
                            if (element.division === division.id) {
                                element.division = division;
                            }
                        });
                    });
                }
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
 
    // public showDeleteDialog(user: Model) {
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
    //             this.delete(user);
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
 
    showModalDialog(id, isNew, setView) {
        this.displayModal = true;
        this.originDestinationID = {id: id, isNew: isNew}
        this.setViewOriginDestination = setView;
    }
 
    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }
 
    changeSelectedmodels() {
        this.selectedModelsChange.emit(this.selectedModels);
    }
 
    applyFilter(whatFilter) {
        if (whatFilter === "precall") {
            this.precall_filter === false ? this.precall_filter = true : this.precall_filter = false
            if (this.precall_filter === true) {
                this.filters.push({ key: 'filter{precall}', value: this.precall_filter.toString()})
            } else {
                this.filters = this.filters.filter(filter => filter.key != 'filter{precall}');
            }
        }
        this.getModels();
    }
}
