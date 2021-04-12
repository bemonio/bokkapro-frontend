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
import { PackageService } from 'src/app/pages/package/_services';
import { QuoteTemplateService } from 'src/app/pages/quote-template/_services';
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
  public requesting: boolean;

  public tabs = {
    BASIC_TAB: 0,
    OFFICE_TAB: 1,
  };

  public amount: AbstractControl;
  public difference_reason: AbstractControl;
  public verified: AbstractControl;
  public verified_at: AbstractControl;

  public package: AbstractControl;
  public bank_account: AbstractControl;
  public employee_who_counts: AbstractControl;
  public supervisor: AbstractControl;
  
  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

  public packageId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private templateService: QuoteTemplateService,
    private packageService: PackageService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      amount: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      difference_reason: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      verified: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      verified_at: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      package: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      bank_account: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      employee_who_counts: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      supervisor: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.amount = this.formGroup.controls['amount'];
    this.difference_reason = this.formGroup.controls['difference_reason'];
    this.verified = this.formGroup.controls['verified'];
    this.verified_at = this.formGroup.controls['verified_at'];
    this.package = this.formGroup.controls['package'];
    this.bank_account = this.formGroup.controls['bank_account'];
    this.employee_who_counts = this.formGroup.controls['employee_who_counts'];
    this.supervisor = this.formGroup.controls['supervisor'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.packageId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.packageId;
      }
      this.get();
    });
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
        if (response.packages) {
          this.model.package = response.packages[0];
        }
        if (response.banksaccounts) {
          this.model.bank_account = response.bank_account[0];
        }
        if (response.employees) {
          this.model.employee_who_counts = response.employee_who_counts[0];
        }
        if (response.employees) {
          this.model.supervisor = response.supervisor[0];
        }

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.amount.setValue(this.model.amount);
      this.difference_reason.setValue(this.model.difference_reason);
      this.verified.setValue(this.model.verified);
      this.verified_at.setValue(this.model.verified_at);

      if (this.model.package) {
        this.package.setValue(this.model.package);
      }
      if (this.model.bank_account) {
        this.bank_account.setValue(this.model.bank_account);
      }
      if (this.model.employee_who_counts) {
        this.employee_who_counts.setValue(this.model.employee_who_counts);
      }
      if (this.model.supervisor) {
        this.supervisor.setValue(this.model.supervisor);
      }
    } else {
      if (this.packageId) {
        this.getPackageById(this.packageId);
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
    model.package = this.model.package.id;
    model.bank_account = this.model.bank_account.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = this.model.supervisor.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent + '/depositforms']);
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
    model.package = this.model.package.id;
    model.bank_account = this.model.bank_account.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = this.model.supervisor.id;

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
        this.router.navigate([this.parent + '/depositforms']);
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

  public changeTemplate() {
    // this.template.reset();
    this.formGroup.markAllAsTouched();
  }

  getPackageById(id) {
    this.packageService.getById(id).toPromise().then(
      response => {
        this.package.setValue(response.package)
      },
      error => {
        console.log('error getting package');
      }
    );
  }
}
