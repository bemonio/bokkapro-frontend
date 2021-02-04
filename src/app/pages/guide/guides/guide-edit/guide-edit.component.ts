import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { GuideModel as Model } from '../../_models/guide.model';
import { GuideService as ModelsService } from '../../_services/guide.service';

@Component({
  selector: 'app-guide-edit',
  templateUrl: './guide-edit.component.html',
  styleUrls: ['./guide-edit.component.scss']
})
export class GuideEditComponent implements OnInit, OnDestroy {
  @Input() transfer: boolean;
  @Input() listVouchers: any[];
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  
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
  public department_origin: AbstractControl;  
  public department_destination: AbstractControl;  
  public employee_origin: AbstractControl;  
  public employee_destination: AbstractControl;  

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public optionsAmPm: {key: string, value: string}[];

  public newVoucher: boolean;

  public parent: string;

  public typeGuide: number;

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
    this.loading = false;

    this.parent = '/guides';

    this.newVoucher = false;
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.formGroup = this.fb.group({
      description: ['', Validators.compose([Validators.maxLength(30)])],
      status: ['', Validators.compose([Validators.maxLength(30)])],
      am_pm: ['', Validators.compose([Validators.maxLength(30)])],
      date: ['', Validators.compose([Validators.maxLength(30)])],
      department_origin: [{value: ''}, Validators.compose(this.transfer ? [Validators.maxLength(30)]: [Validators.required, Validators.maxLength(30)])],
      department_destination: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      employee_origin: [{value: ''}, Validators.compose(this.transfer ? [Validators.maxLength(30)]: [Validators.required, Validators.maxLength(30)])],
      employee_destination: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
    });
    this.description = this.formGroup.controls['description'];
    this.status = this.formGroup.controls['status'];
    this.date = this.formGroup.controls['date'];
    this.am_pm = this.formGroup.controls['am_pm'];
    this.department_origin = this.formGroup.controls['department_origin'];
    this.department_destination = this.formGroup.controls['department_destination'];
    this.employee_origin = this.formGroup.controls['employee_origin'];
    this.employee_destination = this.formGroup.controls['employee_destination'];

    this.optionsAmPm = [];
    this.optionsAmPm.push({key: 'AM', value: 'AM'});
    this.optionsAmPm.push({key: 'PM', value: 'PM'});


    if (this.route.parent.parent.snapshot.url[0].path)  {
      this.parent = '/' + this.route.parent.parent.snapshot.url[0].path;
      if (this.transfer) {
        this.typeGuide = 3;
      } else {
        switch (this.route.parent.parent.snapshot.url[0].path) {
          case 'guidesinput':
              this.typeGuide = 1;
            break;
          case 'guidesoutput':
              this.typeGuide = 2;
            break;
          case 'guidescheck':
              this.typeGuide = 3;
            break;
        }
      }
    }

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
        if (response.department_origin)
          this.model.department_origin = response.department_origin[0];
        if (response.department_destination)
          this.model.department_destination = response.department_destination[0];
        if (response.employee_origin)
          this.model.employee_origin = response.employee_origin[0];
        if (response.employee_destination)
          this.model.employee_destination = response.employee_destination[0];

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
      if (this.model.department_origin) {
        this.department_origin.setValue(this.model.department_origin);
      }
      if (this.model.department_destination) {
        this.department_destination.setValue(this.model.department_destination);
      }
      if (this.model.employee_origin) {
        this.employee_origin.setValue(this.model.employee_origin);
      }
      if (this.model.employee_destination) {
        this.employee_destination.setValue(this.model.employee_destination);
      }
    }

    this.formGroup.markAllAsTouched();

    if (this.transfer) {
      this.department_origin.setValue(this.authService.currentUserValue.employee.position.department);
      this.employee_origin.setValue(this.authService.currentUserValue.employee);
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
    this.loading = true;

    let model = this.model;
    model.am_pm = this.am_pm.value.value;
    model.date = this.formatDate(this.date.value);
    model.department_origin = this.model.department_origin.id;
    model.department_destination = this.model.department_destination.id;
    model.employee_origin = this.model.employee_origin.id;
    model.employee_destination = this.model.employee_destination.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent]);
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
    
    model.date = undefined;
    if (this.date.value) {
      model.date = this.formatDate(this.date.value);
    }

    model.type_guide = this.typeGuide;
    model.department_origin = this.model.department_origin.id;
    model.department_destination = this.model.department_destination.id;
    model.employee_origin = this.model.employee_origin.id;
    model.employee_destination = this.model.employee_destination.id;
    model.vouchers = [];

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent]);
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

  public cancel() {
    this.close.emit(true);
  }
}
