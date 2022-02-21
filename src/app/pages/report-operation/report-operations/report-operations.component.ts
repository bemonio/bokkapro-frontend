import { Component, OnInit } from '@angular/core';
import { ReportOperationService as ModelService } from '../_services/report-operation.service';
import { ReportOperationModel as Model } from '../_models/report-operation.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { environment } from '../../../../environments/environment';
import { TokenStorageService } from './../../../modules/auth/_services/auth-http/token-storage.service';

@Component({
    selector: 'app-report-operations',
    templateUrl: './report-operations.component.html',
    styleUrls: ['./report-operations.component.scss']
})
export class ReportOperationsComponent implements OnInit {
    REPORT_URL = `${environment.reportUrl}`;

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

    constructor(
        public modelsService: ModelService,
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        private token: TokenStorageService,
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

        this.page = 1;
        this.total_page = 0;
        this.per_page = 100
        this.totalRecords = 0;

        this.requesting = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];
        this.getModels();
    }

    ngOnInit() {
        this.requesting = false;
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


        this.getModels();
    }

    public getModels() {
        this.requesting = true;
        setTimeout(() => {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.requesting = false;
                this.models = response.report_operations;
                if(response.offices){
                    response.offices.forEach(office => {
                        this.models.forEach(element => {
                            if (element.office === office.id) {
                                element.office = office;
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

    print(model) {
        let url = environment.apiUrl + 'pdf/operations?id=' + model.id;
        if (model.file) {
            url = model.file
        }
        window.open(url, '_blank');
    }

    getUrlReport (value) {
        let start = value.created_at.substring(5, 7) + '/' + value.created_at.substring(8, 10) + '/' + value.created_at.substring(0, 4);
        let next_day = new Date(start);
        next_day.setDate(next_day.getDate() + 1);
        let end = String(next_day.getMonth() + 1).toString().padStart(2, '0') + '/' + String(next_day.getDate()).padStart(2, '0') + '/' + next_day.getFullYear();
        
        if (value.next_business_day) {
            if (new Date(value.next_business_day) > new Date(start)) {
                end = value.next_business_day.substring(5, 7) + '/' + value.next_business_day.substring(8, 10) + '/' + value.next_business_day.substring(0, 4);
            }
        }

        let url = 
            this.REPORT_URL +
            '/Reports/Viewer' + 
            '?id=' + 4 +
            '&token=' + this.token.getToken() + 
            '&user=' + this.authService.currentUserValue.id + 
            '&employee=' + this.authService.currentUserValue.employee.id +
            '&json_params={"desde":"' + start + '","hasta":"' + end + '"}';
        window.open(url, '_blank');
    }
}
