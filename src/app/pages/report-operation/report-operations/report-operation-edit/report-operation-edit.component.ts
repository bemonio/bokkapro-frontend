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
  public requesting: boolean;

  public tabs = {
    BASIC_TAB: 0,
    PROFILE: 1,
  };

  public closed_at: AbstractControl;
  public hours_close: AbstractControl;
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
      hours_close: [''],
      employees_open: [''],
      employees_close: ['']
    });
    this.closed_at = this.formGroup.controls['closed_at'];
    this.hours_close = this.formGroup.controls['hours_close'];
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
        return of({ 'report-operation': new Model() });
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
        return of({ 'report-operation': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.report_operation;
        let employees = [];
        if (response.report_operation.employees_close) {
          response.report_operation.employees_close.forEach(employee_close => {
            response.employees.forEach(employee => {
              if (employee_close == employee.id) {
                employees.push(employee);
              }
            });
          });
        }
        this.model.employees_close = employees;

        employees = [];
        if (response.report_operation.employees_open) {
          response.report_operation.employees_open.forEach(employee_open => {
            response.employees.forEach(employee => {
              if (employee_open == employee.id) {
                employees.push(employee);
              }
            });
          });
        }
        this.model.employees_open = employees;
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model && this.model.id) {
      this.closed_at.setValue(this.model.closed_at);
      this.hours_close.setValue(this.model.hours_close);
      this.employees_open.setValue(this.model.employees_open);
      this.employees_close.setValue(this.model.employees_close);
    }
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
    const sbUpdate = this.modelsService.patch(this.id, this.model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/reports/operations']);
        }
        this.formGroup.reset()
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
    model.employees_open = employees_open;

    let employees_close = [];
    this.model.employees_close.forEach(element => {
      employees_close.push(element.id);
    });
    model.employees_close = employees_close;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
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
