import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { DepositFormModel as Model } from '../../_models/deposit-form.model';
import { DepositFormService as ModelsService } from '../../_services/deposit-form.service';

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
  };

  public amount: AbstractControl;
  public difference_reason: AbstractControl;
  public verified: AbstractControl;
  public verified_at: AbstractControl;
  public bank_account: AbstractControl;
  public employee_who_counts: AbstractControl;
  public supervisor: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public packageId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      amount: ['', Validators.compose([Validators.required])],
      difference_reason: ['', Validators.compose([Validators.required])],
      verified: ['', Validators.compose([Validators.required])],
      verified_at: [''],
      bank_account: ['', Validators.compose([Validators.required])],
      employee_who_counts: ['', Validators.compose([Validators.required])],
      supervisor: ['', Validators.compose([Validators.required])],
    });
    this.amount = this.formGroup.controls['amount']
    this.difference_reason = this.formGroup.controls['difference_reason']
    this.verified = this.formGroup.controls['verified']
    this.verified_at = this.formGroup.controls['verified_at']
    this.bank_account = this.formGroup.controls['bank_account']
    this.employee_who_counts = this.formGroup.controls['employee_who_counts']
    this.supervisor = this.formGroup.controls['supervisor']
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.get();

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
        return of({ 'deposit_form': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.deposit_form;
        if (response.packages) {
          this.model.packages = response.packages[0];
        }
        if (response.bank_account) {
          this.model.bank_account = response.bank_account[0];
        }
        if (response.employee_who_counts) {
          this.model.employee_who_counts = response.employee_who_counts[0];
        }
        if (response.supervisor) {
          this.model.supervisor = response.supervisor[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.amount.setValue(this.model.amount)
      this.difference_reason.setValue(this.model.difference_reason)
      this.verified.setValue(this.model.verified)
      this.verified_at.setValue(new Date(this.model.verified_at));
      if (this.model.bank_account) {
        this.bank_account.setValue(this.model.bank_account);
      }
      if (this.model.employee_who_counts) {
        this.employee_who_counts.setValue(this.model.employee_who_counts);
      }
      if (this.model.supervisor) {
        this.supervisor.setValue(this.model.supervisor);
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
    model.bank_account = this.model.bank_account.id
    model.employee_who_counts = this.model.employee_who_counts.id
    model.supervisor = this.model.supervisor.id
    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent + '/depositforms']);
        }
      }),
      catchError((error) => {
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
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.type_currency
      this.model = response.currency
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.bank_account = this.model.id
    model.employee_who_counts = this.model.id
    model.supervisor = this.model.id

    let packages = [];
    packages.push(this.packageId);
    model.packages = packages;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
      }),
      catchError((error) => {
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
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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
}
