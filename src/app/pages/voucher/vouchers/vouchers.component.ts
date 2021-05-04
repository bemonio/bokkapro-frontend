import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService as ModelService } from '../_services/voucher.service';
import { VoucherModel as Model } from '../_models/voucher.model';
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

@Component({
    selector: 'app-vouchers',
    templateUrl: './vouchers.component.html',
    styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent implements OnInit {

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

    public formGroup: FormGroup;
    public employee_id_filter: AbstractControl;
    public department_id_filter: AbstractControl;
    public venue_id_filter: AbstractControl;

    searchGroup: FormGroup;

    public requesting: boolean;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public guideId: number;
    public parent: string;

    public displayModal: boolean;

    public divisionChangeSubscription: Subscription;

    constructor(
        public modelsService: ModelService,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        public divisionService: DivisionService,
        fb: FormBuilder) {
        this.formGroup = fb.group({
            'employee_id_filter': [''],
            'department_id_filter': [''],
            'venue_id_filter': [''],
        });
        this.employee_id_filter = this.formGroup.controls['employee_id_filter'];
        this.department_id_filter = this.formGroup.controls['department_id_filter'];
        this.venue_id_filter = this.formGroup.controls['venue_id_filter'];

        this.searchGroup = fb.group({
            searchTerm: [''],
        });

        this.translate.get('COMMON.MESSAGE_CONFIRM_DELETE').subscribe((res: string) => {
            this.message_confirm_delete = res;
        });

        this.showTableCheckbox = true;
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
        // this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.subscribeToDivisionChange();

        this._with = [];
        this._with.push({key: 'include[]', value: 'company.*'})
        this._with.push({key: 'include[]', value: 'currency.*'})
    }

    public loadLazy(event?: LazyLoadEvent) {
        if (event) {
            this.page = (event.first / this.per_page) + 1;
            if (event.sortField) {
                if (event.sortOrder === -1) {
                    this.sort = '-' + event.sortField;
                } else {
                    this.sort = event.sortField;
                }
            } else {
                this.sort = '-id';
            }

            if (event.globalFilter) {
                this.query = event.globalFilter;
            } else {
                this.query = undefined;
            }

            if (event.rows) {
                this.per_page = event.rows;
            }    
        }

        this.filters = [];
        if (this.route.parent.parent.parent.snapshot.url.length > 0) {
            this.route.parent.parent.parent.params.subscribe((params) => {
                if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                    this.guideId = params.id;
                    this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.guideId;
                    this.filters.push({ key: 'filter{guides}', value: this.guideId.toString() })
                }
                this.getModels();
            });
        } else {
            this.filters.push({ key: 'filter{division}', value: this.authService.currentDivisionValue.id.toString() })
            this.filters.push({ key: 'filter{verificated}', value: '1' })
            this.getModels();
        }
    }

    public getModels() {
        this.requesting = true;
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).toPromise().then(
            response => {
                this.requesting = false;
                this.models = [];
                response.vouchers.forEach(element => {
                    this.models.push(element);
                });
                if(response.companies){
                    response.companies.forEach(company => {
                        this.models.forEach(element => {
                            if (element.company === company.id) {
                                element.company = company;
                            }
                        });
                    });
                }
                if(response.currencies){
                    response.currencies.forEach(currency => {
                        this.models.forEach(element => {
                            if (element.currency === currency.id) {
                                element.currency = currency;
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
                    ([key, value]) => this.toastService.growl('error', key + ': ' + value)
                );
            }
        );
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

    showModalDialog() {
        this.displayModal = true;
    }

    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }

    public subscribeToDivisionChange() {
        this.divisionChangeSubscription = this.divisionService._change$
        .subscribe(response => {
            this.selectedModels = [];
            this.loadLazy();
        });
    }
}
