import { Component, OnInit } from '@angular/core';
import { GuideService as ModelService } from '../_services/guide.service';
import { GuideModel as Model } from '../_models/guide.model';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription  } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';

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
    public filters: {key: string, value: string}[];

    public formGroup: FormGroup;
    public employee_id_filter: AbstractControl;
    public division_id_filter: AbstractControl;
    public venue_id_filter: AbstractControl;

    public searchGroup: FormGroup;

    public verificationGroup: FormGroup;
    public vouchers: AbstractControl;

    public loading: boolean;
  
    public confirmDialogPosition: string;
    public message_confirm_delete: string;

    public showTableCheckbox: boolean;

    public parent: string;
    public permission: string;

    public displayModal: boolean;
    public verificationGuide: any;
    public listVouchers: any[];

    constructor(
      public modelsService: ModelService,
      public translate: TranslateService,
      private confirmationService: ConfirmationService,
      private toastService: ToastService,
      public authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      fb: FormBuilder) {
        this.formGroup = fb.group({
            'employee_id_filter': [''],
            'division_id_filter': [''], 
            'venue_id_filter': [''],
        });
        this.employee_id_filter = this.formGroup.controls['employee_id_filter'];    
        this.division_id_filter = this.formGroup.controls['division_id_filter'];
        this.venue_id_filter = this.formGroup.controls['venue_id_filter'];

        this.searchGroup = fb.group({
            searchTerm: [''],
        });

        this.verificationGroup = fb.group({
            vouchers: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        });
        this.vouchers = this.verificationGroup.controls['vouchers'];

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

        this.loading = false;
        this.displayModal = false;

        this.confirmDialogPosition = 'right';

        this.models = [];
        this.selectedModels = [];
        // this.getModels();
    }

    ngOnInit() {
    }
    
    public loadLazy(event: LazyLoadEvent) {
        this.page = (event.first / this.per_page) + 1;
        if (event.sortField) {
            if (event.sortOrder === -1) {
                this.sort =  '-' + event.sortField;
            } else {
                this.sort =  event.sortField;
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

        this.filters = [];
        switch (this.route.parent.parent.snapshot.url[0].path) {
            case 'guidesinput':
                this.filters.push ({key: 'filter{division_destination}[]', value: this.authService.currentDivisionValue.id.toString()})
                this.parent = 'guidesinput';
                this.permission = 'guideinput';
                break;
            case 'guidesoutput':
                this.filters.push ({key: 'filter{division_origin}[]', value: this.authService.currentDivisionValue.id.toString()})
                this.parent = 'guidesoutput';
                this.permission = 'guideoutput';
                break;
            case 'guidescheck':
                this.filters.push ({key: 'filter{type_guide}[]', value: '3'})
                this.parent = 'guidescheck';
                this.permission = 'guidecheck';
                break;
        }
        this.getModels()
    }

    public getModels() {
        this.loading = true;
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters).toPromise().then(
            response => {
                this.loading = false;
                this.models = response.guides;
                this.totalRecords = response.meta.total_results;
            },
            error => {
                this.loading = false;
                Object.entries(error.error).forEach(
                    ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
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
                Object.entries(error.error).forEach(
                    ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
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
                    Object.entries(error.error).forEach(
                        ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
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
                return of({'guide':new Model()});
            }),
            catchError((error) => {
                Object.entries(error.error).forEach(
                    ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
                );
                return of({'guide':new Model()});
            }),
        ).subscribe((response: any) => {
            if (response) {
                this.verificationGuide = response.guide;
                this.verificationGuide.vouchers = response.guide.vouchers;
                let count = this.verificationGuide.vouchers.length + this.countPackages(this.verificationGuide);
                this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(count)]));
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
            if (element.code === event.value) {
                element.verificated = true;
                found = true;
            }
            element.packages.forEach(element2 => {
                if (element2.code === event.value) {
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
        this.verificationGuide.vouchers.forEach(element => {
            if (element.code === event.value) {
                element.verificated = false;
            }
            element.packages.forEach(element2 => {
                if (element2.code === event.value) {
                    element2.verificated = false;
                }
            });
        });
    }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.verificationGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.verificationGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.verificationGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.verificationGroup.controls[controlName];
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
    let params = {
        "status":"1",
        "vouchers":[]
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
            Object.entries(error.error).forEach(
              ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
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

  countPackages(guide) {
    let count = 0;
    if (guide.vouchers) {
        guide.vouchers.forEach(element => {
            if (element.packages) {
                count =+ element.count_packages;
            }
        });
    }
    return count;
  }

  public changeCountPackages() {
    this.vouchers.setValidators(Validators.compose([Validators.required, Validators.minLength(this.listVouchers.length), Validators.maxLength(this.listVouchers.length)]));
    this.formGroup.markAllAsTouched();
  }
}
