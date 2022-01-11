import { Component, Input, Output, OnDestroy, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ChestModel as Model } from '../../_models/chest.model';
import { ChestService as ModelsService } from '../../_services/chest.service';
import { ServiceOrderService } from 'src/app/pages/service-order/_services';
import * as moment from 'moment';

@Component({
  selector: 'app-chest-edit',
  templateUrl: './chest-edit.component.html',
  styleUrls: ['./chest-edit.component.scss']
})
export class ChestEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chestID: { id: number, isNew: boolean};
  @Output() displayModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public code: AbstractControl;
  public rental: AbstractControl;
  public risk: AbstractControl;
  public cost_risk: AbstractControl;
  public key_custody: AbstractControl;
  public total_cost: AbstractControl;

  public service_order: AbstractControl;

  public filterServOrdCompany: any;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsTypeService: { key: string, value: string }[];

  public serviceOrderId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private serviceOrderService: ServiceOrderService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;
    this.filterServOrdCompany = undefined;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      rental: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      risk: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      cost_risk: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      key_custody: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      total_cost: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      service_order: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.code = this.formGroup.controls['code'];
    this.rental = this.formGroup.controls['rental'];
    this.risk = this.formGroup.controls['risk'];
    this.cost_risk = this.formGroup.controls['cost_risk'];
    this.key_custody = this.formGroup.controls['key_custody'];
    this.total_cost = this.formGroup.controls['total_cost'];
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

    if (this.chestID){
      if(this.chestID.id){
        this.id = this.chestID.id; 
        this.get();
      } else {
        this.id = undefined;
        this.get();
      }
    } 
    this.route.params.subscribe((params) => {
      if (this.route.snapshot.url.length > 0) {
        this.serviceOrderId = params.id;
      }
      this.get();
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  get() {
    this.requesting = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        if(!this.chestID){
          this.id = Number(params.get('id'));
        }
        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'chest': new Model() });
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
        return of({ 'chest': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.chest;

        if (response.service_orders) {
          this.model.service_order = response.service_orders[0];
          this.filterServOrdCompany = response.service_orders[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      if (this.model.service_order) {
        this.code.setValue(this.model.code);
        this.rental.setValue(this.model.rental);
        this.risk.setValue(this.model.risk);
        this.cost_risk.setValue(this.model.cost_risk);
        this.key_custody.setValue(this.model.key_custody);
        this.total_cost.setValue(this.model.total_cost);
        this.service_order.setValue(this.model.service_order);
      }
    } else {
      this.code.setValue('');
      this.rental.setValue('');
      this.risk.setValue('');
      this.cost_risk.setValue('');
      this.key_custody.setValue('');
      this.total_cost.setValue('');
      this.service_order.setValue('');
      if (this.serviceOrderId) {
        this.getServiceOrderById(this.serviceOrderId);
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
    model.rental = this.model.rental;
    model.risk = this.model.risk;
    model.cost_risk = this.model.cost_risk;
    model.key_custody = this.model.key_custody;
    model.total_cost = this.model.total_cost;
    model.service_order = this.model.service_order.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.chestID) {
            this.hideModal();
          } else if(this.parent) {
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.chest
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.code = this.model.code;
    model.rental = this.model.rental;
    model.risk = this.model.risk;
    model.cost_risk = this.model.cost_risk;
    model.key_custody = this.model.key_custody;
    model.total_cost = this.model.total_cost;
    model.service_order = this.model.service_order.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.chestID) {
            this.hideModal();
          } else if(this.parent) {
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.chest as Model
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

  getServiceOrderById(id) {
    this.serviceOrderService.getById(id).toPromise().then(
      response => {
        this.service_order.setValue(response.service_order);
        this.filterServOrdCompany = response.service_order;
      },
      error => {
        console.log('error getting service_order');
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

  hideModal(){
    this.displayModal.emit()
  }
}
