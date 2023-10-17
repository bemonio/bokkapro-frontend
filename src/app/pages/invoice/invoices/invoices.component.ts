import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService as ModelService } from '../_services/invoice.service';
import { InvoiceModel as Model } from '../_models/invoice.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DivisionService } from '../../division/_services';
import { ContractService } from 'src/app/pages/contract/_services';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-invoices',
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

    public promiseForm: Promise<any>;

    public models: Model[];
    public selectedModels: Model[];

    public page: number;
    public total_page: number;
    public per_page: number;
    public totalRecords: number;

    public sort: string;
    public query: string;
    public filters: { key: string, value: string }[];
    public _with: { key: string, value: string }[];

    searchGroup: FormGroup;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public packingId: number;
    public parent: string;

    public InvoiceId: number;
    public contracts: [];

    public displayModal: boolean;
    public showListFormDetails: boolean;

    constructor(
        public modelsService: ModelService,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        private contractService: ContractService,
        fb: FormBuilder) {

        this.searchGroup = fb.group({
            searchTerm: [''],
        });

        this.translate.get('COMMON.MESSAGE_CONFIRM_DELETE').subscribe((res: string) => {
            this.message_confirm_delete = res;
        });

        this.showTableCheckbox = false;

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
        if (this.route.parent.parent.parent.snapshot.url.length > 0) {
            this.route.parent.parent.parent.params.subscribe((params) => {
                if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                    let params1 = params.id;
                    this.filters.push({ key: 'filter{packing}', value: params1.toString() })
      
                    if (this.route.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                        this.route.parent.parent.parent.parent.parent.parent.params.subscribe((params) => {
                            let params2 = params.id;

                            if (this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                                this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.params.subscribe((params) => {
                                    let params3 = params.id;
        
                                    if (this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                                        this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params3;
                                        this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                                        this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                                        this.filters.push({ key: 'filter{packing}', value: params1.toString() })
                                    }
                                })
                            } else {
                                this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                                this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                                this.filters.push({ key: 'filter{packing}', value: params1.toString() })
                            }
                        })
                    } else {
                        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                    }
                }
                this.getModels();
            });
        } else {
            this.getModels();
        }
    }

    public getModels() {
        this.requesting = true;
        let contract_company;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.requesting = false;
                this.models = [];
                response.invoices.forEach(element => {
                    contract_company = this.getContractById(2036);
                    console.log('result contract', this.contracts);
                    element.contract_array = contract_company;
                    this.models.push(element);
                });
                console.log(this.models);
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

    showModalDialog(id) {
        this.displayModal = true;
        this.showListFormDetails 
        ? this.showListFormDetails = false 
        : this.showListFormDetails = true;
        this.InvoiceId = id; 
    }

    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }

    public getContractById(id) {
        let response_contract;
        this.contractService.getById(id).toPromise().then(
          response => {
            this.contracts = response.contract;
          },
          error => {
            console.log('error getting contract');
          }
        );
        return response_contract
    }

    print(model) {
        let url = environment.apiUrl + 'pdf/invoices?id=' + model.id;
        if (model.file) {
            url = model.file
        }
        window.open(url, '_blank');
    }
}
