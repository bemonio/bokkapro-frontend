import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { DivisionModel as Model } from '../../_models/division.model';
import { DivisionService as ModelsService } from '../../_services/division.service';

@Component({
  selector: 'app-division-edit',
  templateUrl: './division-edit.component.html',
  styleUrls: ['./division-edit.component.scss']
})
export class DivisionEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean;

  public tabs = {
    BASIC_TAB: 0,
    EMPLOYEE_TAB: 1
  };

  public name: AbstractControl;
  public description: AbstractControl;  
  public office: AbstractControl;  
  public employees: AbstractControl;  
  public type_division: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService
  ) {  
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.maxLength(30)])],
      office: ['', Validators.compose([Validators.required])],
      type: [''],
      employees: ['', Validators.compose([Validators.required])],
    });
    this.name = this.formGroup.controls['name'];
    this.description = this.formGroup.controls['description'];
    this.office = this.formGroup.controls['office'];
    this.type_division = this.formGroup.controls['type_division'];
    this.employees = this.formGroup.controls['employees'];
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
        return of({'division':new Model()});
      }),
      catchError((error) => {
        this.requesting = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of({'division':new Model()});
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.division;
        if (response.offices) {
          this.model.office = response.offices[0];
        }
        if (response.employees) {
          this.model.employees = response.employees;
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();  
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.name.setValue(this.model.name);
      this.description.setValue(this.model.description);
      if (this.model.office) {
        this.office.setValue(this.model.office);
      }
      if (this.model.employees) {
        this.employees.setValue(this.model.employees);
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
    model.office = this.model.office.id;
    let employees = [];
    this.model.employees.forEach(element => {
      employees.push(element.id);
    });
    model.employees = employees;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/divisions']);
        }
      }),
      catchError((error) => {
        this.requesting = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.division
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;

    let model = this.model;
    model.office = this.model.office.id;
    let employees = [];
    this.model.employees.forEach(element => {
      employees.push(element.id);
    });
    model.employees = employees;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/divisions']);
        } else {
          this.formGroup.reset()
        }
      }),
      catchError((error) => {
        this.requesting = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.division as Model
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
