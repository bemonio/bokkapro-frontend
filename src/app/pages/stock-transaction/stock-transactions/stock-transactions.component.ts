import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockTransactionService as ModelService } from '../_services/stock-transaction.service';
import { StockTransactionModel as Model } from '../_models/stock-transaction.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
@Component({
    selector: 'app-stock-transactions',
    templateUrl: './stock-transactions.component.html',
    styleUrls: ['./stock-transactions.component.scss']
})
export class StockTransactionsComponent implements OnInit {
    @Input() serviceOrderId: any;
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

    // public formGroup: FormGroup;
    // public employee_id_filter: AbstractControl;
    // public department_id_filter: AbstractControl;
    // public venue_id_filter: AbstractControl;

    searchGroup: FormGroup;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public displayModal: boolean;
    public showTableCheckbox: boolean;

    public serOrderId: number;
    public parent: string;
    public stockTransactionID: { id: number, isNew: boolean };
    public setViewStockTransaction: boolean;
    constructor(
        public modelsService: ModelService,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        private route: ActivatedRoute,
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
        this.displayModal = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];
        this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.stockTransactionID = {id: undefined, isNew: false};
        this._with = [];
        this._with.push({key: 'include[]', value: 'service_order.*'})
    }

    ngOnChanges() {
        this.ngOnInit();
        this.loadLazy();
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

        if (this.serviceOrderId) {
            this.filters.push({ key: 'filter{service_order}', value: this.serviceOrderId.toString() })
            this.parent = '/' + this.route.parent.parent.snapshot.url[0].path + '/edit/' + this.serviceOrderId;
            this.getModels();
        } else {
            if (this.route.parent.parent.parent.snapshot.url.length > 0) {
                this.route.parent.parent.parent.params.subscribe((params) => {
                    if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                        this.serOrderId = params.id;
                        if (this.route.parent.parent.parent.snapshot.url[0].path === 'edit') {
                            this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.serOrderId;
                        } else {
                            this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/view/' + this.serOrderId;
                        }
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
                this.models = response.stock_transactions;
                if (response.offices) {
                    response.offices.forEach(office => {
                        this.models.forEach(element => {
                            if (element.office === office.id) {
                                element.office = office;
                            }
                        });
                    });
                }
                if (response.service_orders) {
                    response.service_orders.forEach(service_order => {
                        this.models.forEach(element => {
                            if (element.service_order === service_order.id) {
                                element.service_order = service_order;
                            }
                        });
                    });
                }
                if (response.service_orders) {
                    response.employees.forEach(employee => {
                        this.models.forEach(element => {
                            if (element.employee === employee.id) {
                                element.employee = employee;
                            }
                        });
                    });
                }
                if (response.type_product_transactions) {
                    response.type_product_transactions.forEach(type_product_transaction => {
                        this.models.forEach(element => {
                            if (element.type_product_transaction === type_product_transaction.id) {
                                element.type_product_transaction = type_product_transaction;
                            }
                        });
                    });
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
        this.stockTransactionID = {id: id, isNew: isNew}
        this.setViewStockTransaction = setView;
    }

    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }

    changeSelectedmodels() {
        this.selectedModelsChange.emit(this.selectedModels);
    }
}
