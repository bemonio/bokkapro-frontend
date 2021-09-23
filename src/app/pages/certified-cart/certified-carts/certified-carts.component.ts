import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertifiedCartService as ModelService } from '../_services/certified-cart.service';
import { CertifiedCartModel as Model } from '../_models/certified-cart.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-certified-carts',
    templateUrl: './certified-carts.component.html',
    styleUrls: ['./certified-carts.component.scss']
})
export class CertifiedCartsComponent implements OnInit {

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

    // public formGroup: FormGroup;
    // public employee_id_filter: AbstractControl;
    // public department_id_filter: AbstractControl;
    // public venue_id_filter: AbstractControl;

    searchGroup: FormGroup;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public parent: string;

    public displayModal: boolean;
    public verificationCertifiedCart: any;
    public listVouchers: any[];

    public verificationGroup: FormGroup;
    public vouchers: AbstractControl;
    public code: AbstractControl;

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

        this.verificationGroup = fb.group({
            vouchers: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            code: [''],
        });
        this.vouchers = this.verificationGroup.controls['vouchers'];
        this.code = this.verificationGroup.controls['code'];

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
        // this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
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
        this.getModels();
    }

    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).toPromise().then(
            response => {
                this.models = response.certified_carts;
                this.totalRecords = response.meta.total_results;
                if(response.vouchers){
                    response.vouchers.forEach(voucher => {
                        this.models.forEach(element => {
                            if (element.vouchers === voucher.id) {
                                element.vouchers = voucher;
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

    public verification(certified_cart) {
        this.displayModal = true;
        this.listVouchers = [];
        this.get(certified_cart.id)
    }

    get(id) {
        const sb = this.route.paramMap.pipe(
            switchMap(params => {
                if (id || id > 0) {
                    return this.modelsService.getById(id);
                }
                return of({ 'certified_cart': new Model() });
            }),
            catchError((error) => {
                let messageError = [];
                if (!Array.isArray(error.error)) {
                    messageError.push(error.error);
                } else {
                    messageError = error.error;
                }
                Object.entries(messageError).forEach(
                    ([key, value]) => this.toastService.growl('error', key + ': ' + value)
                );
                return of({ 'certified_cart': new Model() });
            }),
        ).subscribe((response: any) => {
            if (response) {
                this.verificationCertifiedCart = response.certified_cart;
                this.verificationCertifiedCart.vouchers = response.vouchers;
                let count = this.verificationCertifiedCart.vouchers.length + this.countPackings(this.verificationCertifiedCart);
                this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
                if (response.certified_cart.code) {
                    this.code.setValidators(Validators.compose([Validators.required, Validators.pattern(response.certified_cart.code)]));
                }
            }
        });
    }

    public addListVouchers(event) {
        let found = false;
        this.verificationCertifiedCart.vouchers.forEach(element => {
            
            let evenValue = event.value.replace(/[^a-zA-Z0-9]/g, '');

            if (element.code === evenValue) {
                element.verificated = true;
                found = true;
            }
            element.packings.forEach(element2 => {
                if (element2.code === evenValue) {
                    element2.verificated = true;
                    found = true;
                }
            });
        });
        if (!found) {
            this.listVouchers.forEach(element => {
                if (element == event.value) {
                    this.listVouchers.pop();
                }
            });
        }
    }

    public removeListVouchers(event) {
        this.verificationCertifiedCart.vouchers.forEach(element => {
            if (element.code === event.value) {
                element.verificated = false;
            }
            element.packings.forEach(element2 => {
                if (element2.code === event.value) {
                    element2.verificated = false;
                }
            });
        });
    }

    countPackings(certified_cart) {
        let count = 0;
        if (certified_cart.vouchers) {
            certified_cart.vouchers.forEach(element => {
                if (element.packings) {
                    count = count + element.count_packings;
                }
            });
        }
        return count;
    }

    // helpers for View
    isControlValid(controlName: string, formGroup: FormGroup): boolean {
        const control = formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string, formGroup: FormGroup): boolean {
        const control = formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation: string, controlName: string, formGroup: FormGroup) {
        const control = formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName: string, formGroup: FormGroup): boolean {
        const control = formGroup.controls[controlName];
        return control.dirty || control.touched;
    }

    public getValidClass(valid) {
        let stringClass = 'form-control form-control-lg form-control-solid';
        if (valid) {
            stringClass += ' is-valid';
        } else {
            stringClass += ' is-invalid';
        }
        return stringClass;
    }

    save() {
        let division = this.authService.currentDivisionValue.id.toString();
        let params = {
            "verificated": true,
            "vouchers": [],
            "division": division
        };
        this.verificationCertifiedCart.vouchers.forEach(element => {
            params.vouchers.push(element.id);
        });

        const sbUpdate = this.modelsService.patch(this.verificationCertifiedCart.id, params).pipe(
            tap(() => {
                this.toastService.growl('success', 'success');
            }),
            catchError((error) => {
                if (error.error instanceof Array) {
                    let messageError = [];
                    if (!Array.isArray(error.error)) {
                        messageError.push(error.error);
                    } else {
                        messageError = error.error;
                    }
                    Object.entries(messageError).forEach(
                        ([key, value]) => this.toastService.growl('error', key + ': ' + value)
                    );
                } else {
                    this.toastService.growl('error', 'error' + ': ' + error.error)
                }
                return of(this.verificationCertifiedCart);
            })
        ).subscribe(response => {
            this.displayModal = false;
            this.getModels();
        });
    }
}
