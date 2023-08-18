import { Component, OnInit, OnDestroy } from '@angular/core';
import { GuideService as ModelService } from '../_services/guide.service';
import { GuideModel as Model } from '../_models/guide.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DivisionService } from '../../division/_services';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
    selector: 'app-guides',
    templateUrl: './guides.component.html',
    styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit, OnDestroy {

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

    public searchGroup: FormGroup;
    public search_filter: AbstractControl;
    public date_filter: AbstractControl;
    public created_at_filter: AbstractControl;
    public am_pm_filter: AbstractControl;
    public type_guide: number;

    public showFilter: boolean;

    public exportGroup: FormGroup;
    public date_export: AbstractControl;
    public am_pm_export: AbstractControl;

    public verificationGroup: FormGroup;
    public vouchers: AbstractControl;
    public certified_cart_code: AbstractControl;

    public requesting: boolean = false;
    public size_width: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public voucherId: number;
    public parent: string;
    public permission: string;

    public displayModal: boolean;
    public displayModalExport: boolean;

    public verificationGuides: any[];
    public listVouchers: any[];

    public optionsAmPm: { key: string, value: string }[];

    private unsubscribe: Subscription[] = [];

    constructor(
        public modelsService: ModelService,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        public divisionService: DivisionService,
        private router: Router,
        private route: ActivatedRoute,
        fb: FormBuilder) {
        this.searchGroup = fb.group({
            'search_filter': [''],
            'date_filter': [''],
            'created_at_filter': [''],
            'am_pm_filter': [''],
        });
        this.search_filter = this.searchGroup.controls['search_filter'];
        this.date_filter = this.searchGroup.controls['date_filter'];
        this.created_at_filter = this.searchGroup.controls['created_at_filter'];
        this.am_pm_filter = this.searchGroup.controls['am_pm_filter'];

        this.date_filter.setValue(new Date());

        this.exportGroup = fb.group({
            'date_export': [''],
            'am_pm_export': [''],
        });
        this.date_export = this.exportGroup.controls['date_export'];
        this.am_pm_export = this.exportGroup.controls['am_pm_export'];

        this.verificationGroup = fb.group({
            vouchers: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            certified_cart_code: [''],
        });
        this.vouchers = this.verificationGroup.controls['vouchers'];
        this.certified_cart_code = this.verificationGroup.controls['certified_cart_code'];

        this.translate.get('COMMON.MESSAGE_CONFIRM_DELETE').subscribe((res: string) => {
            this.message_confirm_delete = res;
        });

        this.showTableCheckbox = true;
        this.parent = '';

        this.page = 1;
        this.total_page = 0;
        this.per_page = 100
        this.totalRecords = 0;
        this.filters = [];
        this.parent = 'guides';
        this.permission = 'guide';

        this.requesting = false;

        this.displayModal = false;
        this.displayModalExport = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];
        this.verificationGuides = [];
        this.listVouchers = [];

        this.optionsAmPm = [];
        this.optionsAmPm.push({ key: 'TODO', value: 'ALL' });
        this.optionsAmPm.push({ key: 'AM', value: 'AM' });
        this.optionsAmPm.push({ key: 'PM', value: 'PM' });    
        // this.getModels();

        this.showFilter = false;
    }

    ngOnInit() {
        this.requesting = false;
        this.subscribeToDivisionChange();
        this.screenWidth();
    }

    static matches(form: AbstractControl){
        return form.get('email').value == form.get('emailConfirm').value ? null : {equals: true};
    }

    public loadLazy(event?: LazyLoadEvent) {
        if (event && event.first) {
            console.log('evento',event)
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
        
        if (this.created_at_filter.value) {
            this.filters.push({ key: 'filter{created_at.icontains}[]', value: this.formatDate(this.created_at_filter.value) })
        }

        if (this.date_filter.value && this.showFilter) {
            this.filters.push({ key: 'filter{date.icontains}[]', value: this.formatDate(this.date_filter.value) })
        }

        if (this.am_pm_filter.value) {
            if (this.am_pm_filter.value.value != 'ALL') {
                this.filters.push({ key: 'filter{am_pm}[]', value: this.am_pm_filter.value.value })
            }
        }

        switch (this.route.parent.parent.snapshot.url[0].path) {
            case 'guidesinput':
                this.filters.push({ key: 'filter{division_destination}[]', value: this.authService.currentDivisionValue.id.toString() })
                this.parent = 'guidesinput';
                this.permission = 'guideinput';
                this.showFilter = true;
                this.type_guide = 1;
                break;
            case 'guidesoutput':
                this.filters.push({ key: 'filter{division_origin}[]', value: this.authService.currentDivisionValue.id.toString() })
                this.parent = 'guidesoutput';
                this.permission = 'guideoutput';
                this.showFilter = true;
                this.type_guide = 3;
                break;
            case 'guidescheck':
                this.filters.push({ key: 'filter{type_guide}[]', value: '2' })
                this.parent = 'guidescheck';
                this.permission = 'guidecheck';
                this.showFilter = true;
                break;
            case 'guides':
                this.showFilter = true;
                break;
            default: 
                this.showFilter = false;
                break;
        }

        if (this.route.snapshot.url.length > 0) {
            this.route.params.subscribe((params) => {
                if (this.route.snapshot.url.length > 0) {
                    this.voucherId = params.id;
                    if(this.voucherId){
                        this.filters.push({ key: 'filter{vouchers}', value: this.voucherId.toString() })
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
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.requesting = false;
                //this.models = response.guides;
                //console.log("Vouches_new",this.models);
                response.guides.forEach(element => {
                if(element.type_guide === this.type_guide || element.type_guide === 2)
                    this.models.push(element);
                });
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

    get(id) {
        const sb = this.route.paramMap.pipe(
            switchMap(params => {
                if (id || id > 0) {
                    return this.modelsService.getById(id);
                }
                return of({ 'guide': new Model() });
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
                return of({ 'guide': new Model() });
            }),
        ).subscribe((response: any) => {
            if (response) {
                this.verificationGuides = [];
                this.verificationGuides.push(response.guide);
                let count = this.voucherLenght(this.verificationGuides, true) + this.countPackings(this.verificationGuides, true, true) + this.countCerifiedCart(this.verificationGuides);                
                this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
            }
        });
    }

    public verification(guide) {
        this.displayModal = true;
        this.listVouchers = [];
        this.get(guide.id)
    }

    public verificationList() {
        this.displayModal = true;
        this.listVouchers = [];
        this.verificationGuides = this.selectedModels;
        console.log(this.voucherLenght(this.verificationGuides, true))
        console.log(this.countPackings(this.verificationGuides, true, true))
        console.log(this.countCerifiedCart(this.verificationGuides))
        let count = this.voucherLenght(this.verificationGuides, true) + this.countPackings(this.verificationGuides, true, true) + this.countCerifiedCart(this.verificationGuides);
        this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
    }

    public voucherLenght(guides, only_not_verified) {
        let count = 0;
        guides.forEach(guides => {
            guides.vouchers.forEach(voucher => {
                if ((only_not_verified == false) || (only_not_verified && voucher.verificated == false)) {
                    count = count + 1;
                }
            });
        });
        return count;
    }

    public countCerifiedCart(guides) {
        let count = 0;
        guides.forEach(guide => {
            if (guide.certified_cart == true) {
                count = count + 1;
            }
        });
        return count;
    }

    public addListVouchers(event) {
        let found = false;
        this.verificationGuides.forEach(guide => {
            let evenValue = event.value.replace(/[^a-zA-Z0-9]/g, '');
            guide.vouchers.forEach(voucher => {
                if (voucher.code === evenValue) {
                    voucher.verificated = true;
                    found = true;
                }
                if (guide.division_destination.type_division !== 1) {
                    voucher.packings.forEach(packing => {
                        if (packing.code === evenValue) {
                            packing.verificated = true;
                            found = true;
                        }
                    });
                }
            });
            if (guide.certified_cart_code === evenValue) {
                guide.verificated = true;
                found = true;                        
            }
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
        this.verificationGuides.forEach(guide => {
            guide.vouchers.forEach(voucher => {
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
        let employee = this.authService.currentUserValue.employee.id;
        let params = {
            "status": "1",
            "guides": [],
            "employee_destination": employee
        };
        this.verificationGuides.forEach(guide => {            
            params.guides.push(guide.id);
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
                return of(this.verificationGuides);
            })
        ).subscribe(response => {
            this.displayModal = false;
            this.getModels();
        });
    }

    countPackings(guides, operations, only_not_verified) {
        let count = 0;
        if (operations) {
            guides.forEach(guide => {
                if (guide.division_destination.type_division != 1) {
                    if (guide.vouchers) {
                        guide.vouchers.forEach(voucher => {
                            if (voucher.packings) {
                                voucher.packings.forEach(packing => {
                                    if ((only_not_verified == false) || (only_not_verified && packing.verificated == false)) {
                                        count = count + 1;
                                    }
                                });
                            }        
                        });
                    }
                }
            });
        } else {
            guides.forEach(guide => {
                if (guide.vouchers) {
                    guide.vouchers.forEach(voucher => {
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

    public formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        let hours = '' + d.getHours();
        let minutes = '' + d.getMinutes();
        let seconds = '' + d.getSeconds();
    
        if (month.length < 2) {
          month = '0' + month;
        }
        if (day.length < 2) {
          day = '0' + day;
        }
    
        if (hours.length < 2) {
          hours = '0' + hours;
        }
    
        if (minutes.length < 2) {
          minutes = '0' + minutes;
        }
    
        if (seconds.length < 2) {
          seconds = '0' + seconds;
        }
    
        return [year, month, day].join('-');
    }

    public showExportDialog() {
        this.displayModalExport = true;
    }

    public export() {
        let url = environment.apiUrl + 'export/guides?';

        if (this.date_export.value) {
            let date = new Date(this.date_export.value);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            url += 'filter{date}[]=' + this.formatDate(date) + '&';
        }

        if (this.am_pm_export.value) {
            if (this.am_pm_export.value.value != 'ALL') {
                url += 'filter{am_pm}[]=' + this.am_pm_export.value.value  + '&';
            }
        }

        window.open(url, '_blank');
    }

    public subscribeToDivisionChange() {
        const divisionChangeSubscription = this.divisionService._change$
        .subscribe(response => {
            if (response) {
                this.selectedModels = [];
                // this.loadLazy();
            }
        });
        this.unsubscribe.push(divisionChangeSubscription);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    public showVerificationButton(value) {
        let response = false;
        if ((this.authService.hasPermission('change_' + this.permission)) && ((this.parent == 'guidesinput' && !(value.status == 1)) || (this.parent == 'guidescheck'  && !(value.status == 1)))) {
            if (this.authService.currentUserValue.employee.id !== value.employee_origin.id) {
                response = true;
            }
        }
        return response;
    }

    public closeVerificationModal() {
        this.displayModal = false;
        this.listVouchers = [];
        this.verificationGuides = [];
    }

    public screenWidth(){
        if (screen.width < 600){
            this.size_width = true;
        }
    }
}
