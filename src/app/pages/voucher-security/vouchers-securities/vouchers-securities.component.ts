import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherSecurityService as ModelService } from '../_services/voucher-security.service';
import { VoucherSecurityModel as Model } from '../_models/voucher-security.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DivisionService } from '../../division/_services';
import { GuideModel } from '../../guide/_models/guide.model';
import { GuideService } from '../../guide/_services/guide.service';

@Component({
    selector: 'app-vouchers-securities',
    templateUrl: './vouchers-securities.component.html',
    styleUrls: ['./vouchers-securities.component.scss']
})
export class VouchersSecuritiesComponent implements OnInit, OnDestroy, OnChanges {

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
    public cashier_filter: boolean;
    public active_filter: boolean;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;
    public message_verification_voucher: string;

    public showTableCheckbox: boolean;
    public showRowCheckbox: boolean;

    public paramId: number;
    public parent: string;

    public displayModal: boolean;
    public displayModalCashier: boolean;
    public displayModalCertifiedCart: boolean;
    public displayModalSecurity: boolean;
    
    private unsubscribe: Subscription[] = [];

    public securityGroup: FormGroup;
    public vouchers: AbstractControl;
    public division: AbstractControl;
    public certified_cart: AbstractControl;
    public certified_cart_code: AbstractControl;

    public formGroup: FormGroup;
    public division_id_filter: any;

    public listVouchers: any[];
    public listVouchersSecurity: any[];
    public listVouchersSecurityList: any[];

    constructor(
        public modelsService: ModelService,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        public divisionService: DivisionService,
        public guideService: GuideService,
        fb: FormBuilder) {
        this.formGroup = fb.group({
            // 'employee_id_filter': [''],
            // 'department_id_filter': [''],
            // 'venue_id_filter': [''],
            'division_id_filter': [''],
        });
        // this.employee_id_filter = this.formGroup.controls['employee_id_filter'];
        // this.department_id_filter = this.formGroup.controls['department_id_filter'];
        // this.venue_id_filter = this.formGroup.controls['venue_id_filter'];
        this.division_id_filter = this.formGroup.controls['division_id_filter'];


        this.searchGroup = fb.group({
            searchTerm: [''],
        });

        this.securityGroup = fb.group({
            vouchers: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            division: [''],
            certified_cart: [''],
            certified_cart_code: ['']
        });
        this.vouchers = this.securityGroup.controls['vouchers'];
        this.division = this.securityGroup.controls['division'];
        this.certified_cart = this.securityGroup.controls['certified_cart'];
        this.certified_cart_code = this.securityGroup.controls['certified_cart_code'];

        this.translate.get('COMMON.MESSAGE_CONFIRM_DELETE').subscribe((res: string) => {
            this.message_confirm_delete = res;
        });
        
        this.translate.get('COMMON.MESSAGE_VERIFICATION_VOUCHER').subscribe((res: string) => {
            this.message_verification_voucher = res;
        });

        this.showTableCheckbox = false;
        this.showRowCheckbox = true;
        this.cashier_filter = false;
        this.active_filter = false;
        this.parent = '';

        this.page = 1;
        this.total_page = 0;
        this.per_page = 100
        this.totalRecords = 0;
        this.filters = [];

        this.requesting = false;

        this.displayModal = false;
        this.displayModalCashier = false;
        this.displayModalCertifiedCart = false;
        this.displayModalSecurity = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];

        this.listVouchersSecurity = [];
        this.listVouchersSecurityList = [];
        // this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        
        this.certified_cart.setValue(false);

        this.subscribeToDivisionChange();

        this._with = [];
        this._with.push({key: 'include[]', value: 'currency.*'})
        this._with.push({key: 'include[]', value: 'cashier.*'})
        // this._with.push({key: 'include[]', value: 'certified_cart.*'})
        this._with.push({key: 'include[]', value: 'crew.*'})
        this._with.push({key: 'include[]', value: 'crew_last.*'})
        this._with.push({key: 'include[]', value: 'contract.*'})
        this._with.push({key: 'include[]', value: 'origin_destination.origin.*'})
        this._with.push({key: 'include[]', value: 'origin_destination.destination.*'})
    }

    ngOnChanges(): void {
        this.ngOnInit();
    }
    
    public loadLazy(event?: LazyLoadEvent, isCashierFilter?: string) {
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
        if(this.division_id_filter.id) {
            this.filters.push({ key: 'filter{division}', value: this.division_id_filter.id.toString() })
        }
        if (this.route.parent.parent.parent.snapshot.url.length > 0) {
            this.route.parent.parent.parent.params.subscribe((params) => {
                if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                    this.paramId = params.id;
                    if (this.route.parent.parent.parent.parent.parent.snapshot.url[0].path.startsWith('guide')) {
                        this.filters.push({ key: 'filter{guides}', value: this.paramId.toString() })
                    } else if (this.route.parent.parent.parent.parent.parent.snapshot.url[0].path == 'certifiedcarts') {
                        this.filters.push({ key: 'filter{certified_cart}', value: this.paramId.toString() })
                    }
                    this.paramId = params.id;
                    this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.paramId;
                }
            });
        } else {
            // this.filters.push({ key: 'filter{division}', value: this.authService.currentDivisionValue.id.toString() })
            // this.filters.push({ key: 'filter{verificated}', value: '1' })
        }

        this.filters.push({ key: 'filter{is_active}', value: '1'})
        this.filters.push({ key: 'filter{verificated}', value: 'false'})
        this.getModels();
    }

    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.requesting = false;
                this.models = [];
                response.vouchers.forEach(element => {
                    this.models.push(element);
                });
                if(response.currencies){
                    response.currencies.forEach(currency => {
                        this.models.forEach(element => {
                            if (element.currency === currency.id) {
                                element.currency = currency;
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
                if(response.contracts){
                    response.contracts.forEach(contract => {
                        this.models.forEach(element => {
                            if (element.contract === contract.id) {
                                element.contract = contract;
                            }
                        });
                    });
                }
                if(response.origin_destinations){
                    response.origin_destinations.forEach(origin_destination => {
                        this.models.forEach(element => {
                            if (element.origin_destination === origin_destination.id) {
                                element.origin_destination = origin_destination;
                            }
                        });
                    });
                }
                if(response.locations){
                    response.locations.forEach(location => {
                        this.models.forEach(element => {
                            if(element.origin_destination) {
                                if (element.origin_destination.origin === location.id) {
                                    element.origin_destination.origin = location;
                                }
                            }
                        });
                    });
                }
                if(response.locations){
                    response.locations.forEach(location => {
                        this.models.forEach(element => {
                            if(element.origin_destination){
                                if (element.origin_destination.destination === location.id) {
                                    element.origin_destination.destination = location;
                                }
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
        }, 0)
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

    showModalDialog() {
        this.displayModal = true;
    }

    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }

    showModalDialogCashier() {
        this.displayModalCashier = true;
    }

    hideModalDialogCashier() {
        this.displayModalCashier = false;
        this.getModels();
    }

    showModalDialogCertifiedCart() {
        this.displayModalCertifiedCart = true;
    }

    hideModalDialogCertifiedCart() {
        this.displayModalCertifiedCart = false;
        this.getModels();
    }

    showModalDialogSecurity() {
        this.displayModalSecurity = true;
    }

    hideModalDialogSecurity() {
        this.displayModalSecurity = false;
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

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    applyFilter(whatFilter) {
        if (whatFilter === "cashier") {
            this.cashier_filter === false ? this.cashier_filter = true : this.cashier_filter = false
            if (this.cashier_filter === true) {
                this.filters.push({ key: 'filter{cashier}', value: this.authService.currentUserValue.employee.id })
            } else {
                this.filters = this.filters.filter(filter => filter.key != 'filter{cashier}');
            }
        }
        if (whatFilter === "active") {
            this.active_filter === false ? this.active_filter = true : this.active_filter = false
            if (this.active_filter === true) {
                this.filters = this.filters.filter(filter => filter.key != 'filter{is_active}');
                this.filters.push({ key: 'filter{is_active}', value: '0'})
            } else {
                this.filters = this.filters.filter(filter => filter.key != 'filter{is_active}');
                this.filters.push({ key: 'filter{is_active}', value: '1'})
            }
        }
        this.getModels();
    }

    countPackings(vouchers) {
        let count = 0;
        vouchers.forEach(voucher => {
            if (voucher.packings) {
                voucher.packings.forEach(packing => {
                    count = count + 1;
                });
            }        
        });
        return count;
    }

    public voucherLenght(vouchers) {
        let count = 0;
        vouchers.forEach(voucher => {
            count = count + 1;
        });
        return count;
    }

    public addListVouchers(event) {
        let found = false;

        let page = 1;
        let per_page = 1;
        let sort = undefined;
        let query = undefined;

        this.listVouchersSecurityList.forEach(element => {
            if (element == event.value) {                
                event.value = event.value.replace(/[^a-zA-Z0-9]/g, '')
                this.listVouchersSecurityList.pop();
                this.listVouchersSecurityList.push(event.value);
            }
        });

        let filters = [{ key: 'filter{code}', value: event.value }];
        if(this.division_id_filter.id) {
            filters.push({ key: 'filter{division}', value: this.division_id_filter.id.toString() })
        }
        let _with = undefined;

        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(page, per_page, sort, query, filters, _with).subscribe(
            response => {
                this.requesting = false;
                let models = [];
                response.vouchers.forEach(element => {
                    models.push(element);
                });
                if(response.currencies){
                    response.currencies.forEach(currency => {
                        models.forEach(element => {
                            if (element.currency === currency.id) {
                                element.currency = currency;
                            }
                        });
                    });
                }
                if(response.cashiers){
                    response.cashiers.forEach(cashier => {
                        models.forEach(element => {
                            if (element.cashier === cashier.id) {
                                element.cashier = cashier;
                            }
                        });
                    });
                }
                if(response.contracts){
                    response.contracts.forEach(contract => {
                        models.forEach(element => {
                            if (element.contract === contract.id) {
                                element.contract = contract;
                            }
                        });
                    });
                }
                if(response.origin_destinations){
                    response.origin_destinations.forEach(origin_destination => {
                        models.forEach(element => {
                            if (element.origin_destination === origin_destination.id) {
                                element.origin_destination = origin_destination;
                            }
                        });
                    });
                }
                if(response.locations){
                    response.locations.forEach(location => {
                        models.forEach(element => {
                            if (element.origin_destination.origin === location.id) {
                                element.origin_destination.origin = location;
                            }
                        });
                    });
                }
                if(response.locations){
                    response.locations.forEach(location => {
                        models.forEach(element => {
                            if (element.origin_destination.destination === location.id) {
                                element.origin_destination.destination = location;
                            }
                        });
                    });
                }
                if(response.divisions){
                    response.divisions.forEach(division => {
                        models.forEach(element => {
                            if (element.division === division.id) {
                                element.division = division;
                            }
                        });
                    });
                }

                if (models[0]) {
                    let found = false
                    this.listVouchersSecurity.forEach(element => {
                        if (element.code == event.value) {
                            found = true
                        }
                    });
                    if (!found){
                        models[0].packings.forEach(element => {
                            element.verificated = false;
                        });
                        this.listVouchersSecurity.push(models[0]);
                    }
                }

                this.listVouchersSecurity.forEach(element => {
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
                    this.listVouchersSecurityList.forEach(element => {
                        if (element == event.value) {
                            this.listVouchersSecurityList.pop();
                        }
                    });
                    this.toastService.growl('top-right', 'error', 'error', 'Código: No Encontrado');
                } else {
                    this.toastService.growl('top-right', 'success', 'success', 'Código: Encontrado');
                }
                let count = this.voucherLenght(this.listVouchersSecurity) + this.countPackings(this.listVouchersSecurity);
                this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
                this.securityGroup.markAllAsTouched();        
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
        }, 0)
        // this.subscriptions.push(sb);
    }

    public removeListVouchers(event) {
        let item = 0;
        this.listVouchersSecurity.forEach(element => {            
            if (element.code === event.value) {
                this.listVouchersSecurity.splice(item, 1);
            }
            element.packings.forEach(element2 => {
                if (element2.code === event.value) {
                    element2.verificated = false;
                }
            });            
            item++;
        });
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
    
    transferSecurity() {
        // let employee = this.authService.currentUserValue.employee.id;
        let params = {
            "certified_cart_code":this.certified_cart_code.value,
            "vouchers": [],
            // "employee_destination": employee
        };
        this.listVouchersSecurity.forEach(voucher => {
            params.vouchers.push(voucher.id);
        });

        const sbUpdate = this.modelsService.postListSecurity(params).pipe(
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
                return of(this.listVouchersSecurity);
            })
        ).subscribe(response => {
            this.closeDialogSecurity()
            this.getModels();
        });
    }    

    changeDivisionValue(event) {
        if(event === undefined){
            this.division_id_filter.id = event;
        } else {
            this.division_id_filter.id = event.id;
            this.division.setValue(event);
        }
        this.listVouchersSecurity = [];
        this.listVouchersSecurityList = [];
        this.loadLazy();
    }

    closeDialogSecurity(){
        this.displayModalSecurity = false;
        this.securityGroup.reset();
        this.listVouchersSecurity = [];
        this.listVouchersSecurityList = [];
        this.loadLazy();
    }    

    verifyShowCheckBox(value) {
        let response = false;
        if ((this.authService.currentDivisionValue.id === 2 && this.showRowCheckbox && value.verified_oi === false) || 
            (this.authService.currentDivisionValue.id === 2 && value.is_active === false) ||
            (this.authService.currentDivisionValue.id != 2 && value.is_active === false)) {
            response = true;
        }
        if (this.route.parent.parent.snapshot.url[0].path == "vouchersadmin") {
            response = false;
        }
        if (this.route.parent.parent.snapshot.url[0].path == "vouchersconfirmationdelivered") {
            response = false;
        }
        if (this.route.parent.parent.snapshot.url[0].path == "voucherssecurities") {
            response = false;
        }
        if (!this.showRowCheckbox) {
            response = false;
        }
        return response;
    }
}