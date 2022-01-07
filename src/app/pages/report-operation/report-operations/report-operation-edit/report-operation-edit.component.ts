import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ReportOperationModel as Model } from '../../_models/report-operation.model';
import { ReportOperationService as ModelsService } from '../../_services/report-operation.service';

@Component({
  selector: 'app-report-operation-edit',
  templateUrl: './report-operation-edit.component.html',
  styleUrls: ['./report-operation-edit.component.scss']
})
export class ReportOperationEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    PROFILE: 1,
  };

  public closed_at: AbstractControl;
  public hours_close: AbstractControl;
  public atm: AbstractControl;
  public atm_transit: AbstractControl;
  public packings_pending: AbstractControl;
  public packings_pending_amount: AbstractControl;
  public cash_opening: AbstractControl;
  public employees_close: AbstractControl;
  public employees_open: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

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
      closed_at: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      hours_close: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      atm: [''],
      atm_transit: [''],
      packings_pending: [''],
      packings_pending_amount: [''],
      cash_opening: [''],
      employees_open: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      employees_close: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.closed_at = this.formGroup.controls['closed_at'];
    this.hours_close = this.formGroup.controls['hours_close'];
    this.atm = this.formGroup.controls['atm'];
    this.atm_transit = this.formGroup.controls['atm_transit'];
    this.packings_pending = this.formGroup.controls['packings_pending'];
    this.packings_pending_amount = this.formGroup.controls['packings_pending_amount'];
    this.cash_opening = this.formGroup.controls['cash_opening'];
    this.employees_open = this.formGroup.controls['employees_open'];
    this.employees_close = this.formGroup.controls['employees_close'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.get();
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
        return of({ 'report_operation': new Model() });
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
        return of({ 'report_operation': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.report_operation;
        let employees = [];
        if (response.report_operation && response.report_operation.employees_close) {
          response.report_operation.employees_close.forEach(employee_close => {
            response.employees.forEach(employee => {
              if (employee_close == employee.id) {
                employees.push(employee);
              }
            });
          });
          this.model.employees_close = employees;
        }

        employees = [];
        if (response.report_operation && response.report_operation.employees_open) {
          response.report_operation.employees_open.forEach(employee_open => {
            response.employees.forEach(employee => {
              if (employee_open == employee.id) {
                employees.push(employee);
              }
            });
          });
          this.model.employees_open = employees;
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model && this.model.id) {
      this.closed_at.setValue(new Date(this.model.closed_at));
      this.hours_close.setValue(this.model.hours_close);
      this.atm.setValue(this.model.atm);
      this.atm_transit.setValue(this.model.atm_transit);
      this.packings_pending.setValue(this.model.packings_pending);
      this.packings_pending_amount.setValue(this.model.packings_pending_amount);
      this.cash_opening.setValue(this.model.cash_opening);
      this.employees_open.setValue(this.model.employees_open);
      this.employees_close.setValue(this.model.employees_close);
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
    let employees_open = [];
    this.model.employees_open.forEach(element => {
      employees_open.push(element.id);
    });
    model.employees_open = employees_open;

    let employees_close = [];
    this.model.employees_close.forEach(element => {
      employees_close.push(element.id);
    });
    model.employees_close = employees_close;
    model.closed_at = this.formatDate(this.closed_at.value);

    const sbUpdate = this.modelsService.patch(this.id, this.model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/reports/operations']);
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
      this.model = response.report_operation
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    let model = this.model;
    let employees_open = [];
    this.model.employees_open.forEach(element => {
      employees_open.push(element.id);
    });
    model.employees_open = employees_open

    let employees_close = [];
    this.model.employees_close.forEach(element => {
      employees_close.push(element.id);
    });
    model.employees_close = employees_close;
    model.closed_at = this.formatDate(this.closed_at.value);

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/reports/operations']);
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
      this.model = response.report_operation as Model
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

  public getValidClass(valid) {
    let stringClass = 'form-control form-control-lg form-control-solid';
    if (valid) {
      stringClass += ' is-valid';
    } else {
      stringClass += ' is-invalid';
    }
    return stringClass;
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

    return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
  }
}
