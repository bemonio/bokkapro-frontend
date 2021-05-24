import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { DepositFormModel as Model } from '../../_models/deposit-form.model';
import { DepositFormService as ModelsService } from '../../_services/deposit-form.service';
import { PackingService } from 'src/app/pages/packing/_services';
import { OfficeService } from 'src/app/pages/office/_services';

@Component({
  selector: 'app-deposit-form-edit',
  templateUrl: './deposit-form-edit.component.html',
  styleUrls: ['./deposit-form-edit.component.scss']
})
export class DepositFormEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    DEPOSITFORMDETAIL_TAB: 1,
  };


  public amount: AbstractControl;
  public difference_amount: AbstractControl;
  public review: AbstractControl;
  public bank_account_number: AbstractControl;
  public verified: AbstractControl;
  public verified_at: AbstractControl;

  public packing: AbstractControl;
  public bank_account: AbstractControl;
  public currency: AbstractControl;
  public employee_who_counts: AbstractControl;
  public supervisor: AbstractControl;
  public supervisor_extra: AbstractControl;

  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

  public packingId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private packingService: PackingService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      amount: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      difference_amount: [''],
      review: [''],
      bank_account_number: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      currency: ['', Validators.compose([Validators.required])],
      verified: [''],
      verified_at: [''],
      packing: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      bank_account: [''],
      employee_who_counts: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      supervisor: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      supervisor_extra: [''],
    });
    this.amount = this.formGroup.controls['amount'];
    this.difference_amount = this.formGroup.controls['difference_amount'];
    this.review = this.formGroup.controls['review'];
    this.bank_account_number = this.formGroup.controls['bank_account_number'];
    this.currency = this.formGroup.controls['currency'];
    this.verified = this.formGroup.controls['verified'];
    this.verified_at = this.formGroup.controls['verified_at'];
    this.packing = this.formGroup.controls['packing'];
    this.bank_account = this.formGroup.controls['bank_account'];
    this.employee_who_counts = this.formGroup.controls['employee_who_counts'];
    this.supervisor = this.formGroup.controls['supervisor'];
    this.supervisor_extra = this.formGroup.controls['supervisor_extra'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    if (this.route.parent.parent.parent.snapshot.url.length > 0) {
      this.route.parent.parent.parent.params.subscribe((params) => {
          if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
              let params1 = params.id;
              this.packingId = params1;
              this.getPackingById(params1);

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
                              }
                          })
                      } else {
                        this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                        this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                      }
                  })
              } else {
                  this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
              }
          }
          this.get();
      });
    } else {
        this.get();
    }
  }

  get() {
    this.requesting = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));

        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'deposit_form': new Model() });
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
        return of({ 'deposit_form': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.deposit_form;
        if (response.packings) {
          this.model.packing = response.packings[0]; //ACAAAAAAAAA
        }
        if (response.banksaccounts) {
          this.model.bank_account = response.banksaccounts[0]; //ACAAAAAAAAA
        }
        if (response.currencies) {
          this.model.currency = response.currencies[0];
        }
        if (response.employees) {
          this.model.employee_who_counts = response.employees[0]; //ACAAAAAAAAA
        }
        if (response.employees) {
          this.model.supervisor = response.employees[1]; //ACAAAAAAAAA
        }
        if (response.employees) {
          this.model.supervisor_extra = response.employees[2]; //ACAAAAAAAAA2
        }

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.amount.setValue(this.model.amount)
      this.difference_amount.setValue(this.model.difference_amount)
      this.review.setValue(this.model.review)
      this.bank_account_number.setValue(this.model.bank_account_number)
      this.verified.setValue(this.model.verified)
      this.verified_at.setValue(new Date(this.model.verified_at));
      if (this.model.packing) {
        this.packing.setValue(this.model.packing);
      }
      if (this.model.bank_account) {
        this.bank_account.setValue(this.model.bank_account);
      }
      if (this.model.currency) {
        this.currency.setValue(this.model.currency);
      }
      if (this.model.employee_who_counts) {
        this.employee_who_counts.setValue(this.model.employee_who_counts);
      }
      if (this.model.supervisor) {
        this.supervisor.setValue(this.model.supervisor);
      }
      if (this.model.supervisor_extra) {
        this.supervisor_extra.setValue(this.model.supervisor_extra);
      }
    } else {
      if (this.packingId) {
        this.getPackingById(this.packingId);
      }
    }
    this.formGroup.markAllAsTouched();
  }

  reset() {
    if (this.previous) {
      this.model = Object.assign({}, this.previous);
      this.loadForm();
    }
  }

  save(saveAndExit) {
    this.saveAndExit = saveAndExit;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      this.model = Object.assign(this.model, formValues);
      if (this.id) {
        this.edit();
      } else {
        this.create();
      }
    }
  }

  edit() {
    this.requesting = true;
    let model = this.model;
    model.verified_at = this.formatDate(this.verified_at.value);
    model.packing = this.model.packing.id;
    model.bank_account = this.model.bank_account.id;
    model.currency = this.model.currency.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = this.model.supervisor.id;
    model.supervisor_extra = this.model.supervisor_extra.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/depositforms']);
          } else {
            this.router.navigate(['/depositforms']);
          }
        }
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
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.deposit_form
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;    
    model.packing = this.model.packing.id;
    model.bank_account = this.model.bank_account.id;
    model.currency = this.model.currency.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = this.model.supervisor.id;
    model.supervisor_extra = this.model.supervisor_extra.id;

    model.verified_at = undefined;
    if (this.verified_at.value) {
      model.verified_at = this.formatDate(this.verified_at.value);
    }

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
      }),
      catchError((error) => {
        if (Array.isArray(error.error)) {
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
          this.toastService.growl('error', error.error)
        }
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.deposit_form as Model
      if (this.saveAndExit) {
        if(this.parent){
          this.router.navigate([this.parent + '/depositforms']);
        } else {
          this.router.navigate(['/depositforms']);
        }
      } else {
        this.formGroup.reset()
      }
    });
    // this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(sb => sb.unsubscribe());
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

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
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

  getPackingById(id) {
    this.packingService.getById(id).toPromise().then(
      response => {
        this.packing.setValue(response.packing)
      },
      error => {
        console.log('error getting packing');
      }
    );
  }
}
