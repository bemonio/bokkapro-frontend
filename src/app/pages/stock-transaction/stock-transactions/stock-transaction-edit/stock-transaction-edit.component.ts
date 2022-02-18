import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { StockTransactionModel as Model } from '../../_models/stock-transaction.model';
import { StockTransactionService as ModelsService } from '../../_services/stock-transaction.service';

@Component({
  selector: 'app-stock-transaction-edit',
  templateUrl: './stock-transaction-edit.component.html',
  styleUrls: ['./stock-transaction-edit.component.scss']
})
export class StockTransactionEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public office: AbstractControl;
  public employee: AbstractControl;
  public service_order: AbstractControl;
  public type_product_transaction: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public view: boolean;

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

    this.view = false;

    this.formGroup = this.fb.group({
      office: ['', Validators.compose([Validators.maxLength(255)])],
      employee: ['', Validators.compose([Validators.maxLength(255)])],
      service_order: [''],
      type_product_transaction: ['', Validators.compose([Validators.maxLength(255)])],
    });
    this.office = this.formGroup.controls['office'];
    this.employee = this.formGroup.controls['employee'];
    this.service_order = this.formGroup.controls['service_order'];
    this.type_product_transaction = this.formGroup.controls['type_product_transaction'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.get();

    if (this.route.snapshot.url[0].path == 'view') {
      Object.keys(this.formGroup.controls).forEach(control => {
        this.formGroup.controls[control].disable();
      });
      this.view = true;
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
        return of({ 'stock_transaction': new Model() });
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of({ 'stock_transaction': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.stock_transaction;
        if (response.offices) {
          this.model.office = response.offices[0];
        }
        if (response.employees) {
          this.model.employee = response.employees[0];
        }
        if (response.service_orders) {
          this.model.service_order = response.service_orders[0];
        }
        if (response.type_product_transactions) {
          this.model.type_product_transaction = response.type_product_transactions[0];
        }  
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.office.setValue(this.model.office);
      this.employee.setValue(this.model.employee);
      this.service_order.setValue(this.model.service_order);
      this.type_product_transaction.setValue(this.model.type_product_transaction);
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
    model.type_product_transaction = this.model.type_product_transaction.id;
    model.office = this.model.office.id;
    model.employee = this.model.employee.id;
    if (this.model.service_order) {
      model.service_order = this.model.service_order.id;
    } else {
      delete(model.service_order);
    }

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/stocktransactions']);
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.stock_transaction
      if (response.offices) {
        this.model.office = response.offices[0];
      }
      if (response.employees) {
        this.model.employee = response.employees[0];
      }
      if (response.service_orders) {
        this.model.service_order = response.service_orders[0];
      }
      if (response.type_product_transactions) {
        this.model.type_product_transaction = response.type_product_transactions[0];
      }
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.type_product_transaction = this.model.type_product_transaction.id;
    model.office = this.model.office.id;
    model.employee = this.model.employee.id;
    if (this.model.service_order) {
      model.service_order = this.model.service_order.id;
    } else {
      delete(model.service_order);
    }

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/stocktransactions']);
        } else {
          this.formGroup.reset()
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.stock_transaction as Model
    });
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.ngOnInit();
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
