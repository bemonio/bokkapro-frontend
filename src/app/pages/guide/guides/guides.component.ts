import { Component, OnInit } from '@angular/core';
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
export class GuidesComponent implements OnInit {

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
    public am_pm_filter: AbstractControl;

    public exportGroup: FormGroup;
    public date_export: AbstractControl;
    public am_pm_export: AbstractControl;

    public verificationGroup: FormGroup;
    public vouchers: AbstractControl;
    public certified_cart_code: AbstractControl;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public parent: string;
    public permission: string;

    public displayModal: boolean;
    public displayModalExport: boolean;

    public verificationGuide: any;
    public listVouchers: any[];

    public optionsAmPm: { key: string, value: string }[];

    public divisionChangeSubscription: Subscription;

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
            'am_pm_filter': [''],
        });
        this.search_filter = this.searchGroup.controls['search_filter'];
        this.date_filter = this.searchGroup.controls['date_filter'];
        this.am_pm_filter = this.searchGroup.controls['am_pm_filter'];

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

        this.showTableCheckbox = false;
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

        this.optionsAmPm = [];
        this.optionsAmPm.push({ key: 'TODO', value: 'ALL' });
        this.optionsAmPm.push({ key: 'AM', value: 'AM' });
        this.optionsAmPm.push({ key: 'PM', value: 'PM' });    
        this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.subscribeToDivisionChange();
    }

    static matches(form: AbstractControl){
        return form.get('email').value == form.get('emailConfirm').value ? null : {equals: true};
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
        if (this.date_filter.value) {
            this.filters.push({ key: 'filter{date}[]', value: this.formatDate(this.date_filter.value) })
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
                break;
            case 'guidesoutput':
                this.filters.push({ key: 'filter{division_origin}[]', value: this.authService.currentDivisionValue.id.toString() })
                this.parent = 'guidesoutput';
                this.permission = 'guideoutput';
                break;
            case 'guidescheck':
                this.filters.push({ key: 'filter{type_guide}[]', value: '3' })
                this.parent = 'guidescheck';
                this.permission = 'guidecheck';
                break;
        }
        this.getModels()
    }

    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.requesting = false;
                this.models = response.guides;
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
                    ([key, value]) => this.toastService.growl('error', key + ': ' + value)
                );
                return of({ 'guide': new Model() });
            }),
        ).subscribe((response: any) => {
            if (response) {
                this.verificationGuide = response.guide;
                this.verificationGuide.vouchers = response.guide.vouchers;
                let count = this.verificationGuide.vouchers.length + this.countPackings(this.verificationGuide);
                this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
                if (response.guide.certified_cart) {
                    this.certified_cart_code.setValidators(Validators.compose([Validators.required, Validators.pattern(response.guide.certified_cart_code)]));
                }
            }
        });
    }

    public verification(guide) {
        this.displayModal = true;
        this.listVouchers = [];
        this.get(guide.id)
    }

    public addListVouchers(event) {
        let found = false;
        this.verificationGuide.vouchers.forEach(element => {
            
            let evenValue = event.value.replace(/[^a-zA-Z0-9]/g, '');

            if (element.code === evenValue) {
                element.verificated = true;
                found = true;
            }
            if (this.verificationGuide.division_destination.name !== 'Operaciones Internas') {
                element.packings.forEach(element2 => {
                    if (element2.code === evenValue) {
                        element2.verificated = true;
                        found = true;
                    }
                });
            }
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
        this.verificationGuide.vouchers.forEach(element => {
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
            "vouchers": [],
            "employee_destination": employee
        };
        this.verificationGuide.vouchers.forEach(element => {
            params.vouchers.push(element.id);
        });

        const sbUpdate = this.modelsService.patch(this.verificationGuide.id, params).pipe(
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
                return of(this.verificationGuide);
            })
        ).subscribe(response => {
            this.displayModal = false;
            this.getModels();
        });
    }

    countPackings(guide) {
        let count = 0;
        if (guide.division_destination.name != 'Operaciones Internas') {
            if (guide.vouchers) {
                guide.vouchers.forEach(element => {
                    if (element.packings) {
                        count = + element.count_packings;
                    }
                });
            }
        }
        return count;
    }

    public changeCountPackings() {
        this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(this.listVouchers.length), Validators.maxLength(this.listVouchers.length)]));
        this.verificationGroup.markAllAsTouched();
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
        this.divisionChangeSubscription = this.divisionService._change$
        .subscribe(response => {
            this.loadLazy();
        });
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
}
