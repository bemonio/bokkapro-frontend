import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { OriginDestinationModel as Model } from '../../_models/origin-destination.model';
import { OriginDestinationService as ModelsService } from '../../_services/origin-destination.service';
import { CompanyService } from 'src/app/pages/company/_services';

@Component({
  selector: 'app-origin-destination-edit',
  templateUrl: './origin-destination-edit.component.html',
  styleUrls: ['./origin-destination-edit.component.scss']
})
export class OriginDestinationEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public type_service: AbstractControl;
  public distrib_charges: AbstractControl;
  public days_month: AbstractControl;
  public monday: AbstractControl;
  public tuesday: AbstractControl;
  public wednesday: AbstractControl;
  public thursday: AbstractControl;
  public friday: AbstractControl;
  public saturday: AbstractControl;
  public sunday: AbstractControl;
  public monday_start_time: AbstractControl;
  public monday_end_time: AbstractControl;
  public tuesday_start_time: AbstractControl;
  public tuesday_end_time: AbstractControl;
  public wednesday_start_time: AbstractControl;
  public wednesday_end_time: AbstractControl;
  public thursday_start_time: AbstractControl;
  public thursday_end_time: AbstractControl;
  public friday_start_time: AbstractControl;
  public friday_end_time: AbstractControl;
  public saturday_start_time: AbstractControl;
  public saturday_end_time: AbstractControl;
  public sunday_start_time: AbstractControl;
  public sunday_end_time: AbstractControl;

  public origin: AbstractControl;
  public destination: AbstractControl;
  public service_order: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsTypeService: { key: string, value: string }[];

  public companyId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private companyService: CompanyService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      type_service: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      distrib_charges: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      days_month: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      monday: [''],
      tuesday: [''],
      wednesday: [''],
      thursday: [''],
      friday: [''],
      saturday: [''],
      sunday: [''],
      monday_start_time: [''],
      monday_end_time: [''],
      tuesday_start_time: [''],
      tuesday_end_time: [''],
      wednesday_start_time: [''],
      wednesday_end_time: [''],
      thursday_start_time: [''],
      thursday_end_time: [''],
      friday_start_time: [''],
      friday_end_time: [''],
      saturday_start_time: [''],
      saturday_end_time: [''],
      sunday_start_time: [''],
      sunday_end_time: [''],
      origin: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      destination: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      service_order: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.type_service = this.formGroup.controls['type_service'];
    this.distrib_charges = this.formGroup.controls['distrib_charges'];
    this.days_month = this.formGroup.controls['days_month'];
    this.monday = this.formGroup.controls['monday'];
    this.tuesday = this.formGroup.controls['tuesday'];
    this.wednesday = this.formGroup.controls['wednesday'];
    this.thursday = this.formGroup.controls['thursday'];
    this.friday = this.formGroup.controls['friday'];
    this.saturday = this.formGroup.controls['saturday'];
    this.sunday = this.formGroup.controls['sunday'];
    this.monday_start_time = this.formGroup.controls['monday_start_time'];
    this.monday_end_time = this.formGroup.controls['monday_end_time'];
    this.tuesday_start_time = this.formGroup.controls['tuesday_start_time'];
    this.tuesday_end_time = this.formGroup.controls['tuesday_end_time'];
    this.wednesday_start_time = this.formGroup.controls['wednesday_start_time'];
    this.wednesday_end_time = this.formGroup.controls['wednesday_end_time'];
    this.thursday_start_time = this.formGroup.controls['thursday_start_time'];
    this.thursday_end_time = this.formGroup.controls['thursday_end_time'];
    this.friday_start_time = this.formGroup.controls['friday_start_time'];
    this.friday_end_time = this.formGroup.controls['friday_end_time'];
    this.saturday_start_time = this.formGroup.controls['saturday_start_time'];
    this.saturday_end_time = this.formGroup.controls['saturday_end_time'];
    this.sunday_start_time = this.formGroup.controls['sunday_start_time'];
    this.sunday_end_time = this.formGroup.controls['sunday_end_time'];
    this.origin = this.formGroup.controls['origin'];
    this.destination = this.formGroup.controls['destination'];
    this.service_order = this.formGroup.controls['service_order'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.optionsTypeService = [
      {key: 'Pick Up', value: 'Pick Up'},
      {key: 'Delivery', value: 'Delivery'},
    ];

    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.companyId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.companyId;
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
        return of({ 'origin_destination': new Model() });
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
        return of({ 'origin_destination': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.origin_destination;
        if (response.locations) {
          this.model.origin = response.locations[0];
        }
        if (response.locations) {
          this.model.destination = response.locations[0];
        }
        if (response.service_orders) {
          this.model.service_order = response.service_orders[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.monday.setValue(false);
    this.tuesday.setValue(false);
    this.wednesday.setValue(false);
    this.thursday.setValue(false);
    this.friday.setValue(false);
    this.saturday.setValue(false);
    this.sunday.setValue(false);
    this.monday_start_time.setValue(undefined)
    this.monday_end_time.setValue(undefined)
    this.tuesday_start_time.setValue(undefined)
    this.tuesday_end_time.setValue(undefined)
    this.wednesday_start_time.setValue(undefined)
    this.wednesday_end_time.setValue(undefined)
    this.thursday_start_time.setValue(undefined)
    this.thursday_end_time.setValue(undefined)
    this.friday_start_time.setValue(undefined)
    this.friday_end_time.setValue(undefined)
    this.saturday_start_time.setValue(undefined)
    this.saturday_end_time.setValue(undefined)
    this.sunday_start_time.setValue(undefined)
    this.sunday_end_time.setValue(undefined)

    if (this.model.id) {

      // let date = new Date();
      // date.setHours(Number(this.model.monday_start_time.split(':')[0]))
      // date.setMinutes(Number(this.model.monday_start_time.split(':')[1]))
      // date.setSeconds(Number(this.model.monday_start_time.split(':')[2]))
      // this.monday_start_time.setValue(date);

      this.type_service.setValue({ key: this.model.type_service, value: this.model.type_service });
      this.distrib_charges.setValue(this.model.distrib_charges);
      this.days_month.setValue(this.model.days_month);
      this.monday.setValue(this.model.monday);
      this.tuesday.setValue(this.model.tuesday);
      this.wednesday.setValue(this.model.wednesday);
      this.thursday.setValue(this.model.thursday);
      this.friday.setValue(this.model.friday);
      this.saturday.setValue(this.model.saturday);
      this.sunday.setValue(this.model.sunday);
      // this.monday_start_time.setValue(new Date(this.model.monday_start_time));
      this.monday_start_time.setValue(this.getFormatHour(this.model.monday_start_time));
      this.monday_end_time.setValue(this.getFormatHour(this.model.monday_end_time));
      this.tuesday_start_time.setValue(this.getFormatHour(this.model.tuesday_start_time));
      this.tuesday_end_time.setValue(this.getFormatHour(this.model.tuesday_end_time));
      this.wednesday_start_time.setValue(this.getFormatHour(this.model.wednesday_start_time));
      this.wednesday_end_time.setValue(this.getFormatHour(this.model.wednesday_end_time));
      this.thursday_start_time.setValue(this.getFormatHour(this.model.thursday_start_time));
      this.thursday_end_time.setValue(this.getFormatHour(this.model.thursday_end_time));
      this.friday_start_time.setValue(this.getFormatHour(this.model.friday_start_time));
      this.friday_end_time.setValue(this.getFormatHour(this.model.friday_end_time));
      this.saturday_start_time.setValue(this.getFormatHour(this.model.saturday_start_time));
      this.saturday_end_time.setValue(this.getFormatHour(this.model.saturday_end_time));
      this.sunday_start_time.setValue(this.getFormatHour(this.model.sunday_start_time));
      this.sunday_end_time.setValue(this.getFormatHour(this.model.sunday_end_time));
      if (this.model.origin) {
        this.origin.setValue(this.model.origin);
      }
      if (this.model.destination) {
        this.destination.setValue(this.model.destination);
      }
      if (this.model.service_order) {
        this.service_order.setValue(this.model.service_order);
      }
    } else {
      if (this.companyId) {
        this.getCompanyById(this.companyId);
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
    model.type_service = this.type_service.value.value;
    
    this.monday_start_time.value ? model.monday_start_time = this.formatDateHour(this.monday_start_time.value) : undefined;
    this.monday_end_time.value ? model.monday_end_time = this.formatDateHour(this.monday_end_time.value) : undefined;
    this.tuesday_start_time.value ? model.tuesday_start_time = this.formatDateHour(this.tuesday_start_time.value) : undefined;
    this.tuesday_end_time.value ? model.tuesday_end_time = this.formatDateHour(this.tuesday_end_time.value) : undefined;
    this.wednesday_start_time.value ? model.wednesday_start_time = this.formatDateHour(this.wednesday_start_time.value) : undefined;
    this.wednesday_end_time.value ? model.wednesday_end_time = this.formatDateHour(this.wednesday_end_time.value) : undefined;
    this.thursday_start_time.value ? model.thursday_start_time = this.formatDateHour(this.thursday_start_time.value) : undefined;
    this.thursday_end_time.value ? model.thursday_end_time = this.formatDateHour(this.thursday_end_time.value) : undefined;
    this.friday_start_time.value ? model.friday_start_time = this.formatDateHour(this.friday_start_time.value) : undefined;
    this.friday_end_time.value ? model.friday_end_time = this.formatDateHour(this.friday_end_time.value) : undefined;
    this.saturday_start_time.value ? model.saturday_start_time = this.formatDateHour(this.saturday_start_time.value) : undefined;
    this.saturday_end_time.value ? model.saturday_end_time = this.formatDateHour(this.saturday_end_time.value) : undefined;
    this.sunday_start_time.value ? model.sunday_start_time = this.formatDateHour(this.sunday_start_time.value) : undefined;
    this.sunday_end_time.value ? model.sunday_end_time = this.formatDateHour(this.sunday_end_time.value) : undefined;

    model.origin = this.model.origin.id;
    model.destination = this.model.destination.id;
    model.service_order = this.model.service_order.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/origindestinations']);
          } else {
            this.router.navigate(['/origindestinations']);
          }
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
      this.model = response.origin_destination
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.type_service = this.type_service.value.value;

    this.monday_start_time.value ? model.monday_start_time = this.formatDateHour(this.monday_start_time.value) : undefined;
    this.monday_end_time.value ? model.monday_end_time = this.formatDateHour(this.monday_end_time.value) : undefined;
    this.tuesday_start_time.value ? model.tuesday_start_time = this.formatDateHour(this.tuesday_start_time.value) : undefined;
    this.tuesday_end_time.value ? model.tuesday_end_time = this.formatDateHour(this.tuesday_end_time.value) : undefined;
    this.wednesday_start_time.value ? model.wednesday_start_time = this.formatDateHour(this.wednesday_start_time.value) : undefined;
    this.wednesday_end_time.value ? model.wednesday_end_time = this.formatDateHour(this.wednesday_end_time.value) : undefined;
    this.thursday_start_time.value ? model.thursday_start_time = this.formatDateHour(this.thursday_start_time.value) : undefined;
    this.thursday_end_time.value ? model.thursday_end_time = this.formatDateHour(this.thursday_end_time.value) : undefined;
    this.friday_start_time.value ? model.friday_start_time = this.formatDateHour(this.friday_start_time.value) : undefined;
    this.friday_end_time.value ? model.friday_end_time = this.formatDateHour(this.friday_end_time.value) : undefined;
    this.saturday_start_time.value ? model.saturday_start_time = this.formatDateHour(this.saturday_start_time.value) : undefined;
    this.saturday_end_time.value ? model.saturday_end_time = this.formatDateHour(this.saturday_end_time.value) : undefined;
    this.sunday_start_time.value ? model.sunday_start_time = this.formatDateHour(this.sunday_start_time.value) : undefined;
    this.sunday_end_time.value ? model.sunday_end_time = this.formatDateHour(this.sunday_end_time.value) : undefined;

    model.origin = this.model.origin.id;
    model.destination = this.model.destination.id;
    model.service_order = this.model.service_order.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/origindestinations']);
          } else {
            this.router.navigate(['/origindestinations']);
          }
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
      this.model = response.origin_destination as Model
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

  getCompanyById(id) {
    this.companyService.getById(id).toPromise().then(
      response => {
        this.origin.setValue(response.origin)
      },
      error => {
        console.log('error getting origin');
      }
    );
  }

  public formatDateHour(date) {
    const d = new Date(date);
    let hours = '' + d.getHours();
    let minutes = '' + d.getMinutes();
    let seconds = '' + d.getSeconds();

    if (hours.length < 2) {
        hours = '0' + hours;
    }

    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }

    return [hours, minutes, seconds].join(':');
  }

  public getFormatHour(hour){
    if(hour != null){
      let date = new Date();
      date.setHours(Number(hour.split(':')[0]))
      date.setMinutes(Number(hour.split(':')[1]))
      date.setSeconds(Number(hour.split(':')[2]))
      return date;
    }
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
