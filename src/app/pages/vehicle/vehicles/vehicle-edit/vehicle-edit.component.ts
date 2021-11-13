import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { VehicleModel as Model } from '../../_models/vehicle.model';
import { VehicleService as ModelsService } from '../../_services/vehicle.service';
import { OfficeService } from 'src/app/pages/office/_services';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss']
})
export class VehicleEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    PROFILE: 1,
  };

  // public date: AbstractControl;
  public code: AbstractControl;
  public plate: AbstractControl;
  public amount_insured: AbstractControl;
  public is_armored: AbstractControl;
  public office: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public officeId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private officeService: OfficeService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
    });
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required,])],
      plate: ['', Validators.compose([Validators.required,])],
      amount_insured: ['', Validators.compose([Validators.required,])],
      is_armored: ['', Validators.compose([Validators.required,])],
      office: ['', Validators.compose([Validators.required,])],
    });

    this.code = this.formGroup.controls['code'];
    this.plate = this.formGroup.controls['plate'];
    this.amount_insured = this.formGroup.controls['amount_insured'];
    this.is_armored = this.formGroup.controls['is_armored'];
    this.office = this.formGroup.controls['office'];

    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.officeId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.officeId;
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
        return of({ 'vehicle': new Model() });
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
        return of({ 'vehicle': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.vehicle;
        if (response.offices) {
          this.model.office = response.offices[0];
        }

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.is_armored.setValue(false);
    if (this.model && this.model.id) {
      this.code.setValue(this.model.code);
      this.plate.setValue(this.model.plate);
      this.amount_insured.setValue(this.model.amount_insured);
      this.is_armored.setValue(this.model.is_armored);
      if (this.model.office) {
        this.office.setValue(this.model.office);
      }
    } else {
      if (this.officeId) {
        this.getOfficeById(this.officeId);
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
    model.code = this.model.code;
    model.plate = this.model.plate;
    model.amount_insured = this.model.amount_insured;
    model.is_armored = this.model.is_armored;

    this.model.office 
    ? model.office = this.model.office.id 
    : model.office = null;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/vehicles']);
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
      this.model = response.vehicle
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;

    let model = this.model;
    model.code = this.model.code;
    model.plate = this.model.plate;
    model.amount_insured = this.model.amount_insured;
    model.is_armored = this.model.is_armored;

    this.model.office 
    ? model.office = this.model.office.id 
    : model.office = null;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/vehicles']);
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
      this.model = response.vehicle as Model
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

  public getValidClass(valid) {
    let stringClass = 'form-control form-control-lg form-control-solid';
    if (valid) {
      stringClass += ' is-valid';
    } else {
      stringClass += ' is-invalid';
    }
    return stringClass;
  }

  getOfficeById(id) {
    this.officeService.getById(id).toPromise().then(
      response => {
        this.office.setValue(response.offices[0])
      },
      error => {
        console.log('error getting division');
      }
    );
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
