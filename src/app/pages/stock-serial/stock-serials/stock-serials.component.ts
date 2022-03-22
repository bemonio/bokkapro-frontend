import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockSerialService as ModelService } from '../_services/stock-serial.service';
import { StockSerialModel as Model } from '../_models/stock-serial.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
@Component({
    selector: 'app-stock-serials',
    templateUrl: './stock-serials.component.html',
    styleUrls: ['./stock-serials.component.scss']
})
export class StockSerialsComponent implements OnInit {
    @Input() stockTransactionId: any;
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

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public displayModal: boolean;
    public showTableCheckbox: boolean;

    public stockTransId: number;
    public parent: string;
    public stockSerialID: { id: number, isNew: boolean };
    public setViewStockSerial: boolean;

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
        this.stockSerialID = {id: undefined, isNew: false};
        this._with = [];
        this._with.push({key: 'include[]', value: 'stock_transaction.*'})

        this.setViewStockSerial = false;
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

        if (this.stockTransactionId) {
            this.filters.push({ key: 'filter{stock_transaction}', value: this.stockTransactionId.toString() })
            this.parent = '/' + this.route.parent.parent.snapshot.url[0].path + '/edit/' + this.stockTransactionId;
            this.getModels();
        } else {
            if (this.route.parent.parent.parent.snapshot.url.length > 0) {
                this.route.parent.parent.parent.params.subscribe((params) => {
                    if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                        this.stockTransId = params.id;
                        if (this.route.parent.parent.parent.snapshot.url[0].path === 'edit') {
                            this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.stockTransId;
                        } else {
                            this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/view/' + this.stockTransId;
                        }
                        this.filters.push({ key: 'filter{stock_transaction}', value: this.stockTransId.toString() })
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
                this.models = response.stock_serials;
                this.totalRecords = response.meta.total_results;
                if(response.stocks){                
                    response.stocks.forEach(stock => {
                        this.models.forEach(element => {
                            if (element.stock === stock.id) {
                                element.stock = stock;
                            }
                        });
                    });
                }
                if (response.product_and_services) {
                    response.product_and_services.forEach(product_and_service => {
                        this.models.forEach(element => {
                            if (element.product_and_service === product_and_service.id) {
                                element.product_and_service = product_and_service;
                            }
                        });
                    });
                }
                if(response.stock_transactions){                
                    response.stock_transactions.forEach(stock_transaction => {
                        this.models.forEach(element => {
                            if (element.stock_transaction === stock_transaction.id) {
                                element.stock_transaction = stock_transaction;
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
        this.stockSerialID = {id: id, isNew: isNew}
        this.setViewStockSerial = setView;
    }

    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }

    changeSelectedmodels() {
        this.selectedModelsChange.emit(this.selectedModels);
    }
}
