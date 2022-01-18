import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { GuideModel as Model } from '../../_models/guide.model';
import { GuideService as ModelsService } from '../../_services/guide.service';
import { DivisionService } from 'src/app/pages/division/_services';
import { CrewService } from 'src/app/pages/crew/_services';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-guide-edit',
  templateUrl: './guide-edit.component.html',
  styleUrls: ['./guide-edit.component.scss']
})
export class GuideEditComponent implements OnInit, OnDestroy {
  @Input() transfer: boolean;
  @Input()  listVouchers!: Model[] | Model[];
  @Output() listVouchersChange = new EventEmitter<Model[]>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    VOUCHER_TAB: 1,
  };

  public description: AbstractControl;
  public status: AbstractControl;
  public am_pm: AbstractControl;
  public date: AbstractControl;
  // public certified_cart: AbstractControl;
  // public certified_cart_code: AbstractControl;
  public division_origin: AbstractControl;
  public division_destination: AbstractControl;
  public employee_origin: AbstractControl;
  public employee_destination: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public optionsAmPm: { key: string, value: string }[];

  public filterIsCrew: boolean;

  public newVoucher: boolean;

  public parent: string;

  public typeGuide: number;

  private unsubscribe: Subscription[] = [];

  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private divisionService: DivisionService,
    private crewService: CrewService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;
    
    this.view = false;

    this.formGroup = this.fb.group({
      description: [''],
      status: [''],
      am_pm: [''],
      date: [''],
      // certified_cart: [''],
      // certified_cart_code: [''],
      division_origin: ['', Validators.compose([Validators.required,])],
      division_destination: [''],
      employee_origin: ['', Validators.compose([Validators.required,])],
      employee_destination: [''],
    });

    this.description = this.formGroup.controls['description'];
    this.status = this.formGroup.controls['status'];
    this.date = this.formGroup.controls['date'];
    this.am_pm = this.formGroup.controls['am_pm'];
    // this.certified_cart = this.formGroup.controls['certified_cart'];
    // this.certified_cart_code = this.formGroup.controls['certified_cart_code'];
    this.division_origin = this.formGroup.controls['division_origin'];
    this.division_destination = this.formGroup.controls['division_destination'];
    this.employee_origin = this.formGroup.controls['employee_origin'];
    this.employee_destination = this.formGroup.controls['employee_destination'];

    // this.optionsAmPm = [];
    // this.optionsAmPm.push({ key: 'Select', value: '' });
    // this.optionsAmPm.push({ key: 'AM', value: 'AM' });
    // this.optionsAmPm.push({ key: 'PM', value: 'PM' });

    this.optionsAmPm = [
      {key: 'AM', value: 'AM'},
      {key: 'PM', value: 'PM'},
    ];

    this.parent = '/guides';

    this.newVoucher = false;
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.filterIsCrew = false;

    if (this.route.parent.parent.snapshot.url[0].path) {
      this.parent = '/' + this.route.parent.parent.snapshot.url[0].path;
    }

    this.get();

    this.subscribeToDivisionChange();

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

        if (this.route.firstChild) {
          this.activeTabId = this.tabs.VOUCHER_TAB;
        }

        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'guide': new Model() });
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
        return of({ 'guide': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.guide;
        if (response.division_origin)
          this.model.division_origin = response.division_origin[0];
        if (response.division_destination)
          this.model.division_destination = response.division_destination[0];
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

  getDivision(id) {
    const sb = this.route.paramMap.pipe(
        switchMap(params => {
            if (id || id > 0) {
                return this.divisionService.getById(id);
            }
            return of({ 'division': new Model() });
        }),
        catchError((error) => {
            let messageError = [];
            if (!Array.isArray(error.error)) {
                messageError.push(error.error);
            } else {
                messageError = error.error;
            }
            Object.entries(messageError).forEach(
                ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
            );
            return of({ 'division': new Model() });
        }),
    ).subscribe((response: any) => {
        if (response) {
          this.division_destination.setValue(response.division);
        }
    });
  }

  getCrew(id) {
    const sb = this.route.paramMap.pipe(
        switchMap(params => {
            if (id || id > 0) {
              return this.crewService.get(1, 1, '-id', undefined, [{key: 'filter{division}', value: this.division_origin.value ? this.division_origin.value.id : ''},{ key: 'filter{date.icontains}[]', value: formatDate(Date.now(),'yyyy-MM-dd','en-US')}], []);
            }
            return of({ 'crew': new Model() });
        }),
        catchError((error) => {
            let messageError = [];
            if (!Array.isArray(error.error)) {
                messageError.push(error.error);
            } else {
                messageError = error.error;
            }
            Object.entries(messageError).forEach(
                ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
            );
            return of({ 'crew': new Model() });
        }),
    ).subscribe((response: any) => {
        if (response) {
          if(response.employees){
            response.employees.forEach(employee => {
              if (response.crews[0].driver === employee.id) {
                  response.crews[0].driver = employee;
                  this.employee_origin.setValue(employee);
              }
              if (response.crews[0].assistant === employee.id) {
                  response.crews[0].assistant = employee;
              }
              if (response.crews[0].assistant2 === employee.id) {
                  response.crews[0].assistant2 = employee;
              }
            });
          } else {
            this.employee_origin.setValue('');
          }
        }
    });
  }

  loadForm() {
    // this.certified_cart.setValue(false);

    if (this.model && this.model.id) {
      this.description.setValue(this.model.description);
      this.status.setValue(this.model.status);
      // this.am_pm.setValue({ key: this.model.am_pm, value: this.model.am_pm });
      this.date.setValue(new Date(this.model.date));
      // this.certified_cart.setValue(this.model.certified_cart);
      // this.certified_cart_code.setValue(this.model.certified_cart_code);
        if (this.model.division_origin) {
        this.division_origin.setValue(this.model.division_origin);
      }
      if (this.model.division_destination) {
        this.division_destination.setValue(this.model.division_destination);
      }
      if (this.model.employee_origin) {
        this.employee_origin.setValue(this.model.employee_origin);
      }
      if (this.model.employee_destination) {
        this.employee_destination.setValue(this.model.employee_destination);
      }
    }

    if (this.transfer) {
      this.division_origin.setValue(this.authService.currentDivisionValue);
      this.employee_origin.setValue(this.authService.currentUserValue.employee);
      this.date.setValue(new Date());
      this.am_pm.reset();
      this.division_destination.reset();
      if(this.division_origin.value.name === "Apertura"){
        this.getDivision(1);
        // this.division_destination.disabled()
      }
      if(this.division_origin.value.name === "Check IN/OUT"){
        this.getDivision(2);
      }
      this.employee_destination.setValidators([])
    } else {
      // this.employee_destination.setValidators(Validators.compose([Validators.required,]))
      switch (this.route.parent.parent.snapshot.url[0].path) {
        case 'guidesinput':
          this.typeGuide = 1;
          this.division_destination.setValue(this.authService.currentDivisionValue);
          this.employee_destination.setValue(this.authService.currentUserValue.employee);
          break;
        case 'guidesoutput':
          this.typeGuide = 2;
          this.division_origin.setValue(this.authService.currentDivisionValue);
          this.employee_origin.setValue(this.authService.currentUserValue.employee);
          break;
        case 'guidescheck':
          break;
      }
    }

    // this.am_pm.setValidators(Validators.compose([]))
    this.date.setValidators(Validators.compose([]))
    if (this.division_destination.value) {
      if (this.division_destination.value.type_division == 2) {
        this.typeGuide = 3;
        // this.am_pm.setValidators(Validators.compose([Validators.required]))
        this.date.setValidators(Validators.compose([Validators.required]))
      }
    }

    if (!this.typeGuide) {
      this.typeGuide = 2;
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
    // model.am_pm = this.am_pm.value.value;
    model.date = this.formatDate(this.date.value);
    model.certified_cart = this.model.certified_cart;
    model.certified_cart_code = this.model.certified_cart_code;
    model.division_origin = this.model.division_origin.id;
    model.division_destination = this.model.division_destination.id;
    model.employee_origin = this.model.employee_origin.id;
    if (this.model.employee_destination) {
      model.employee_destination = this.model.employee_destination.id;
    } else {
      model.employee_destination = undefined;
    }

    let listVouchers = model.vouchers;
    model.vouchers = [];

    if (listVouchers) {
      listVouchers.forEach(element => {
        model.vouchers.push(element.id);
      });
    }

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
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
      if (response.guide.id) {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent]);
        }
  
        this.requesting = false;
        this.model = response.guide
      }
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;

    let model = this.model;
    // model.am_pm = this.am_pm.value;
    // model.certified_cart = this.certified_cart.value;
    // model.certified_cart_code = this.certified_cart_code.value;

    model.date = undefined;
    if (this.date.value) {
      model.date = this.formatDate(this.date.value);
    }

    if (this.division_destination.value) {
      if (this.division_destination.value.type_division == 2) {
        this.typeGuide = 3;
        // this.am_pm.setValidators(Validators.compose([Validators.required]))
        this.date.setValidators(Validators.compose([Validators.required]))
      }
      if (this.division_destination.value.schedule){
        let am_pm = this.division_destination.value.schedule;
        model.am_pm = am_pm;
      }
    }

    if (!this.typeGuide) {
      this.typeGuide = 2;
    }

    model.type_guide = this.typeGuide;
    model.division_origin = this.model.division_origin.id;
    model.division_destination = this.model.division_destination.id;
    model.employee_origin = this.model.employee_origin.id;
    if (this.model.employee_destination) {
      model.employee_destination = this.model.employee_destination.id;
    } else {
      model.employee_destination = undefined;
    }
    model.status = '1';
    model.vouchers = [];

    if (this.listVouchers) {
      this.listVouchers.forEach(element => {
        model.vouchers.push(element.id);
      });
      model.status = '0';
    }

    const sbCreate = this.modelsService.post(model).pipe(
      catchError((error) => {
        this.requesting = false;
        if (error.error instanceof Array) {
          let messageError = [];
          if (!Array.isArray(error.error)) {
            messageError.push(error.error);
          } else {
            messageError = error.error;
          }
          Object.entries(messageError).forEach(
            ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
          );
        } else {
          this.toastService.growl('top-right', 'error', 'error' + ': ' + error.error)
        }
        return of(this.model);
      })
    ).subscribe(response => {
      this.toastService.growl('top-right', 'success', 'success');
      this.requesting = false;
      this.model = response.guide as Model;
      if (response.guide.id) {
        if (this.saveAndExit) {
          if (this.transfer) {
            this.closeEmit();
          } else {
            this.router.navigate([this.parent]);
          }
        } else {
          if (this.transfer) {
            this.closeEmit();
          } else {
            this.router.navigate([this.parent + '/edit/' + response.guide.id + '/vouchers']);
          }
        }
      }
      this.listVouchers = [];
      this.listVouchersChange.emit(this.listVouchers);
    });
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.ngOnInit();
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

  public closeEmit() {
    this.close.emit(true);
    this.formGroup.reset();
    this.loadForm();
  }

  public changeDivisionOrigin(event) {
    this.employee_origin.setValue(undefined);
    if(this.division_origin.value) {
      if(this.division_origin.value.type_division == 2){
        this.filterIsCrew = true;
        this.getCrew(this.division_origin.value.crew);
      } else {
        this.filterIsCrew = false;
      }
    }
    this.loadForm();
  }

  public changeDivisionDestination(event) {
    this.employee_destination.setValue('');
    this.loadForm();
  }

  public subscribeToDivisionChange() {
    const divisionChangeSubscription = this.divisionService._change$
    .subscribe(response => {
      if (response) {
        this.loadForm();
      }
    });
    this.unsubscribe.push(divisionChangeSubscription);
  }

  ngOnDestroy() {
      this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  public getEditOrView() {
    return this.view ? 'view' : 'edit';
  }
}
