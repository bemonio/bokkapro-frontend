import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailInvoiceService as ModelService } from '../_services/detail-invoice.service';
import { DetailInvoiceModel as Model } from '../_models/detail-invoice.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
@Component({
    selector: 'app-detail-invoices',
    templateUrl: './detail-invoices.component.html',
    styleUrls: ['./detail-invoices.component.scss']
})
export class DetailInvoicesComponent implements OnInit {
    @Input() headInvoiceId: any;
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

    public formGroupGenerate: FormGroup;

    public from_date: AbstractControl;
    public to_date: AbstractControl;
  
    searchGroup: FormGroup;

    public requesting: boolean = false;

    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public displayModal: boolean;
    public showTableCheckbox: boolean;

    public displayModalGenerate: boolean;

    public contId: number;
    public parent: string;
    public headInvoiceID: { id: number, isNew: boolean };
    public setViewHeadInvoice: boolean;

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

        this.formGroupGenerate = fb.group({
            from_date: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            to_date: ['', Validators.compose([Validators.required, Validators.maxLength(255)])], 
        });
        this.from_date = this.formGroupGenerate.controls['from_date'];
        this.to_date = this.formGroupGenerate.controls['to_date'];

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

        this.displayModalGenerate = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];
        this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
        this.headInvoiceID = {id: undefined, isNew: false};
        this._with = [];
        this._with.push({key: 'include[]', value: 'head_invoice.*'})

        this.setViewHeadInvoice = false;
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

        if (this.headInvoiceId) {
            this.filters.push({ key: 'filter{head_invoice}', value: this.headInvoiceId.toString() })
            this.parent = '/' + this.route.parent.parent.snapshot.url[0].path + '/edit/' + this.headInvoiceId;
            this.getModels();
        } else {
            if (this.route.parent.parent.parent.snapshot.url.length > 0) {
                this.route.parent.parent.parent.params.subscribe((params) => {
                    if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                        this.contId = params.id;
                        if (this.route.parent.parent.parent.snapshot.url[0].path === 'edit') {
                            this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.contId;
                        } else {
                            this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/view/' + this.contId;
                        }
                        if (this.route.parent.parent.parent.parent.parent.snapshot.routeConfig.path == 'headinvoices') {
                            this.filters.push({ key: 'filter{head_invoice}', value: this.contId.toString() })
                        } else { 
                            this.filters.push({ key: 'filter{head_invoice}', value: this.contId.toString() })
                        }
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
                this.models = response.detail_invoices;
                this.totalRecords = response.meta.total_results;
                if(response.head_invoices){                
                    response.head_invoices.forEach(head_invoice => {
                        this.models.forEach(element => {
                            if (element.head_invoice === head_invoice.id) {
                                element.head_invoice = head_invoice;
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

    showModalDialog(id, isNew, setView) {
        this.displayModal = true;
        this.headInvoiceID = {id: id, isNew: isNew}
        this.setViewHeadInvoice = setView;
    }

    hideModalDialog() {
        this.displayModal = false;
        this.getModels();
    }

    changeSelectedmodels() {
        this.selectedModelsChange.emit(this.selectedModels);
    }

    showModalDialogGenerate() {
        this.displayModalGenerate = true;
    }

    hideModalDialogGenerate() {
        this.displayModalGenerate = false;
        this.getModels();
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
    
        return [year, month, day].join('-') + ' ' + [hours, minutes].join(':');
    }
}
