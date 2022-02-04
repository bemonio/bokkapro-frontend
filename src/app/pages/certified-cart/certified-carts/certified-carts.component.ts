import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertifiedCartService as ModelService } from '../_services/certified-cart.service';
import { CertifiedCartModel as Model } from '../_models/certified-cart.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DivisionService } from '../../division/_services';

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
    public displayModalTransfer: boolean;
    public verificationCertifiedCart: any;
    public listVouchers: any[];

    public verificationCertifiedCarts: any[];

    private unsubscribe: Subscription[] = [];

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
        public divisionService: DivisionService,
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

        this.showTableCheckbox = true;
        this.parent = '';

        this.page = 1;
        this.total_page = 0;
        this.per_page = 100
        this.totalRecords = 0;

        this.requesting = false;

        this.displayModal = false;
        this.displayModalTransfer = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];
        this.verificationCertifiedCarts = [];
        this.listVouchers = [];
        // this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.subscribeToDivisionChange();
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
        // this.filters.push({ key: 'filter{division}', value: this.authService.currentDivisionValue.id.toString() })
        this.getModels();
    }

    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).toPromise().then(
            response => {
                this.models = [];
                this.totalRecords = response.meta.total_results;
                if(response.vouchers){
                    response.certified_carts.forEach(certified_cart => {
                        let vouchers = [];
                        response.vouchers.forEach(voucher => {
                            certified_cart.vouchers.forEach(element => {
                                if (element === voucher.id) {
                                    vouchers.push(voucher);
                                }
                            });
                        });
                        certified_cart.vouchers = vouchers;
                        this.models.push(certified_cart);
                    });
                }
                this.verificationCertifiedCarts = this.models;
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

    public verification(certified_cart) {
        this.displayModal = true;
        this.listVouchers = [];        
        this.get(certified_cart.id)
    }

    public verificationList() {
        this.displayModal = true;
        this.listVouchers = [];
        this.verificationCertifiedCarts = this.selectedModels;
        let count = this.voucherLenght(this.verificationCertifiedCarts, true) + this.countPackings(this.verificationCertifiedCarts, true, true);
        this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
    }

    get(id) {
        const sb = this.route.paramMap.pipe(
            switchMap(params => {
                if (id || id > 0) {
                    return this.modelsService.getById(id);
                }
                return of({ 'certifiedcart': new Model() });
            }),
            catchError((error) => {
                let messageError = [];
                if (!Array.isArray(error.error)) {
                    messageError.push(error.error);
                } else {
                    messageError = error.error;
                }
                Object.entries(messageError).forEach(
                    ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
                );
                return of({ 'certifiedcart': new Model() });
            }),
        ).subscribe((response: any) => {
            if (response) {
                this.verificationCertifiedCarts = [];
                let certified_cart = response.certified_cart;
                if (response.vouchers) {
                    certified_cart.vouchers = response.vouchers;
                }
                this.verificationCertifiedCarts.push(certified_cart);
                let count = this.voucherLenght(this.verificationCertifiedCarts, true) + this.countPackings(this.verificationCertifiedCarts, true, true);                
                this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
                // if (response.certifiedcart.certified_cart) {
                //     this.certified_cart_code.setValidators(Validators.compose([Validators.required, Validators.pattern(response.certifiedcart.certified_cart_code)]));
                // }
            }
        });
    }

    public addListVouchers(event) {
        let found = false;
        this.verificationCertifiedCarts.forEach(certifiedcart => {
                certifiedcart.vouchers.forEach(voucher => {
                    let evenValue = event.value.replace(/[^a-zA-Z0-9]/g, '');

                    if (voucher.code === evenValue) {
                        voucher.verificated = true;
                        found = true;
                    }
                    // if (certifiedcart.division_destination.type_division !== 1) {
                        voucher.packings.forEach(packing => {
                            if (packing.code === evenValue) {
                                packing.verificated = true;
                                found = true;
                            }
                        });
                    // }
                });
        });
        if (!found) {
            this.listVouchers.forEach(element => {
                if (element == event.value) {
                    this.listVouchers.pop();
                }
            });
            this.toastService.growl('top-right', 'error', 'error', 'Código: No Encontrado');
        } else {
            this.toastService.growl('top-right', 'success', 'success', 'Código: Encontrado');
        }
    }

    public removeListVouchers(event) {
        this.verificationCertifiedCarts.forEach(certifiedcart => {
            certifiedcart.vouchers.forEach(voucher => {
                if (voucher.code === event.value) {
                    voucher.verificated = false;
                }
                voucher.packings.forEach(packing => {
                    if (packing.code === event.value) {
                        packing.verificated = false;
                    }
                });
            });
        });
    }

    countPackings(certifiedcarts, operations, only_not_verified) {
        let count = 0;
        if (operations) {
            certifiedcarts.forEach(certifiedcart => {
                // if (certifiedcart.division_destination.name != 'Operaciones Internas') {
                    if (certifiedcart.vouchers) {
                        certifiedcart.vouchers.forEach(voucher => {
                            if (voucher.packings) {
                                voucher.packings.forEach(packing => {
                                    if ((only_not_verified == false) || (only_not_verified && packing.verified == false)) {
                                        count = count + 1;
                                    }
                                });
                            }        
                        });
                    }
                // }
            });
        } else {
            certifiedcarts.forEach(certifiedcart => {
                if (certifiedcart.vouchers) {
                    certifiedcart.vouchers.forEach(voucher => {
                        if (voucher.packings) {
                            voucher.packings.forEach(packing => {
                                count = count + 1;
                            });
                        }        
                    });
                }
            });
        }
        return count;
    }

    public changeCountPackings() {
        let count = this.voucherLenght(this.verificationCertifiedCarts, true) + this.countPackings(this.verificationCertifiedCarts, true, true);
        this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count), Validators.maxLength(count)]));
        this.verificationGroup.markAllAsTouched();
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
        // let division = this.authService.currentDivisionValue.id.toString();
        let params = {
            "verificated": true,
            "certifiedcarts": [],
        };
        this.verificationCertifiedCarts.forEach(certifiedcart => {            
            params.certifiedcarts.push(certifiedcart.id);
        });

        const sbUpdate = this.modelsService.patch(this.verificationCertifiedCart.id, params).pipe(
            tap(() => {
                this.toastService.growl('top-right', 'success', 'success');
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
                        ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
                    );
                } else {
                    this.toastService.growl('top-right', 'error', 'error' + ': ' + error.error)
                }
                return of(this.verificationCertifiedCart);
            })
        ).subscribe(response => {
            this.displayModal = false;
            this.getModels();
        });
    }

    saveVerification() {
        // let employee = this.authService.currentUserValue.employee.id;
        let params = {
            "verificated": true,
            "certifiedcarts": [],
            // "employee_destination": employee
        };
        this.verificationCertifiedCarts.forEach(certifiedcart => {            
            params.certifiedcarts.push(certifiedcart.id);
        });

        const sbUpdate = this.modelsService.postList(params).pipe(
            tap(() => {
                this.toastService.growl('top-right', 'success', 'success');
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
                        ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
                    );
                } else {
                    this.toastService.growl('top-right', 'error', 'error' + ': ' + error.error)
                }
                return of(this.verificationCertifiedCarts);
            })
        ).subscribe(response => {
            this.displayModal = false;
            this.getModels();
        });
    }

    public voucherLenght(certifiedcarts, only_not_verified) {
        let count = 0;
        certifiedcarts.forEach(certifiedcarts => {
            certifiedcarts.vouchers.forEach(voucher => {
                if ((only_not_verified == false) || (only_not_verified && voucher.verified == false)) {
                    count = count + 1;
                }
            });
        });
        return count;
    }

    showModalTranferDialog() {
        this.displayModalTransfer = true;
    }

    hideModalDialogCertifiedCart() {
        this.displayModalTransfer = false;
        this.getModels();
    }

    public subscribeToDivisionChange() {
        const divisionChangeSubscription = this.divisionService._change$
        .subscribe(response => {
            if (response) {
                this.selectedModels = [];
                this.loadLazy();
            }
        });
        this.unsubscribe.push(divisionChangeSubscription);
    }

    public closeVerificationModal() {
        this.displayModal = false;
        this.listVouchers = [];
        this.verificationCertifiedCarts = [];
    }
}
