import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { GuideModel as Model } from '../../_models/guide.model';
import { GuideService as ModelsService } from '../../_services/guide.service';

@Component({
  selector: 'app-guide-edit',
  templateUrl: './guide-edit.component.html',
  styleUrls: ['./guide-edit.component.scss']
})
export class GuideEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public loading: boolean;

  public tabs = {
    BASIC_TAB: 0,
    VOUCHER_TAB: 1,
  };

  public description: AbstractControl;  
  public status: AbstractControl;  
  public am_pm: AbstractControl;  
  public date: AbstractControl;  

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public optionsAmPm: {key: string, value: string}[];

  public newVoucher: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {  
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.loading = false;

    this.formGroup = this.fb.group({
      description: ['', Validators.compose([Validators.maxLength(30)])],
      status: ['', Validators.compose([Validators.maxLength(30)])],
      am_pm: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      date: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
    });
    this.description = this.formGroup.controls['description'];
    this.status = this.formGroup.controls['status'];
    this.date = this.formGroup.controls['date'];
    this.am_pm = this.formGroup.controls['am_pm'];

    this.optionsAmPm = [];
    this.optionsAmPm.push({key: 'AM', value: 'AM'});
    this.optionsAmPm.push({key: 'PM', value: 'PM'});

    this.newVoucher = false;
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.get();
  }

  get() {
    this.loading = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));

        if (this.route.firstChild) {
          this.activeTabId = this.tabs.VOUCHER_TAB;
        }

        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({'guide':new Model()});
      }),
      catchError((error) => {
        this.loading = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of({'guide':new Model()});
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.model = response.guide;
        this.previous = Object.assign({}, this.model);
        this.loadForm();  
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.description.setValue(this.model.description);
      this.status.setValue(this.model.status);
      this.am_pm.setValue({key: this.model.am_pm, value: this.model.am_pm});
      this.date.setValue(new Date(this.model.date));
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
    this.loading = true;

    let model = this.model;
    model.am_pm = this.am_pm.value.value;
    model.date = this.formatDate(this.date.value);

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/typesguides']);
        }
      }),
      catchError((error) => {
        this.loading = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.guide
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.loading = true;

    let model = this.model;
    model.am_pm = this.am_pm.value.value;
    model.date = this.formatDate(this.date.value);

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/typesguides']);
        }
      }),
      catchError((error) => {
        this.loading = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.guide as Model
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
}
