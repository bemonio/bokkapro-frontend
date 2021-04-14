import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { DepositFormDetailModel as Model } from '../../_models/deposit-formdetail.model';
import { DepositFormDetailService as ModelsService } from '../../_services/deposit-formdetail.service';
import { DepositFormService } from 'src/app/pages/deposit-form/_services';


@Component({
  selector: 'app-deposit-formdetail-edit',
  templateUrl: './deposit-formdetail-edit.component.html',
  styleUrls: ['./deposit-formdetail-edit.component.scss']
})
export class DepositFormDetailEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean;

  public tabs = {
    BASIC_TAB: 0,
  };

  public quantity: AbstractControl;
  public counted_quantity: AbstractControl;
  public deposit_form: AbstractControl;
  public currency_detail: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public depositFormId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private depositFormService: DepositFormService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      quantity: ['', Validators.compose([Validators.required])],
      counted_quantity: ['', Validators.compose([Validators.required])],
      deposit_form: ['', Validators.compose([Validators.required])],
      currency_detail: ['', Validators.compose([Validators.required])],
    });
    this.quantity = this.formGroup.controls['quantity']
    this.counted_quantity = this.formGroup.controls['counted_quantity']
    this.deposit_form = this.formGroup.controls['deposit_form']
    this.currency_detail = this.formGroup.controls['currency_detail']
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.depositFormId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.depositFormId;
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
        return of({ 'deposit_form_detail': new Model() });
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
        return of({ 'deposit_form_detail': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.deposit_form_detail;
        if (response.deposit_forms) {
          this.model.deposit_form = response.deposit_forms[0];
        }
        if (response.currency_details) {
          this.model.currency_detail = response.currency_details[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.quantity.setValue(this.model.quantity)
      this.counted_quantity.setValue(this.model.counted_quantity)
      if (this.model.deposit_form) {
        this.deposit_form.setValue(this.model.deposit_form);
      }
      if (this.model.currency_detail) {
        this.currency_detail.setValue(this.model.currency_detail);
      }
    } else {
      if (this.depositFormId) {
        this.PetDepositFormById(this.depositFormId);
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
    model.deposit_form = this.model.deposit_form.id
    model.currency_detail = this.model.currency_detail.id
    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent + '/depositformsdetails']);
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
    model.deposit_form = this.model.deposit_form.id
    model.currency_detail = this.model.currency_detail.id
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
      this.model = response.deposit_form_detail as Model
      if (this.saveAndExit) {
        this.router.navigate([this.parent + '/depositformsdetails']);
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

  PetDepositFormById(id) {
    this.depositFormService.getById(id).toPromise().then(
      response => {
        this.deposit_form.setValue(response.deposit_form)
      },
      error => {
        console.log('error getting deposit_form');
      }
    );
  }
}
