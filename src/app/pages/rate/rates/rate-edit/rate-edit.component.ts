import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { RateModel as Model } from '../../_models/rate.model';
import { RateService as ModelsService } from '../../_services/rate.service';
import { CompanyService } from 'src/app/pages/company/_services';
import { OfficeService } from 'src/app/pages/office/_services';

@Component({
  selector: 'app-rate-edit',
  templateUrl: './rate-edit.component.html',
  styleUrls: ['./rate-edit.component.scss']
})
export class RateEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    OFFICE_TAB: 1,
  };

  public code: AbstractControl;
  public frequency: AbstractControl;
  public trips_per_month: AbstractControl;
  public fixed_charge: AbstractControl;
  public limit_travel: AbstractControl;
  public limit_appraisal: AbstractControl;
  public limit_manipulation: AbstractControl;
  public limit_materials: AbstractControl;
  public excess_travel: AbstractControl;
  public excess_appraisal: AbstractControl;
  public excess_manipulation: AbstractControl;
  public excess_materials: AbstractControl;
  public office: AbstractControl;
  public product_and_service: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public companyId: number;
  public parent: string;
  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private companyService: CompanyService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required])],
      frequency: ['', Validators.compose([Validators.required])],
      trips_per_month: [''],
      fixed_charge: [''],
      limit_travel: [''],
      limit_appraisal: [''],
      limit_manipulation: [''],
      limit_materials: [''],
      excess_travel: [''],
      excess_appraisal: [''],
      excess_manipulation: [''],
      excess_materials: [''],
      office: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      product_and_service: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.code = this.formGroup.controls['code'];
    this.frequency = this.formGroup.controls['frequency'];
    this.trips_per_month = this.formGroup.controls['trips_per_month'];
    this.fixed_charge = this.formGroup.controls['fixed_charge'];
    this.limit_travel = this.formGroup.controls['limit_travel'];
    this.limit_appraisal = this.formGroup.controls['limit_appraisal'];
    this.limit_manipulation = this.formGroup.controls['limit_manipulation'];
    this.limit_materials = this.formGroup.controls['limit_materials'];
    this.excess_travel = this.formGroup.controls['excess_travel'];
    this.excess_appraisal = this.formGroup.controls['excess_appraisal'];
    this.excess_manipulation = this.formGroup.controls['excess_manipulation'];
    this.excess_materials = this.formGroup.controls['excess_materials'];
    this.office = this.formGroup.controls['office'];
    this.product_and_service = this.formGroup.controls['product_and_service'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

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
        return of({ 'rate': new Model() });
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
        return of({ 'rate': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.rate;
        if (response.offices) {
          this.model.office = response.offices[0];
        }
        if (response.product_and_services) {
          this.model.product_and_service = response.product_and_services[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.code.setValue(this.model.code);
      this.frequency.setValue(this.model.frequency)
      this.trips_per_month.setValue(this.model.trips_per_month)
      this.fixed_charge.setValue(this.model.fixed_charge)
      this.limit_travel.setValue(this.model.limit_travel)
      this.limit_appraisal.setValue(this.model.limit_appraisal)
      this.limit_manipulation.setValue(this.model.limit_manipulation)
      this.limit_materials.setValue(this.model.limit_materials)
      this.excess_travel.setValue(this.model.excess_travel)
      this.excess_appraisal.setValue(this.model.excess_appraisal)
      this.excess_manipulation.setValue(this.model.excess_manipulation)
      this.excess_materials.setValue(this.model.excess_materials)
      if (this.model.office) {
        this.office.setValue(this.model.office);
      }
      if (this.model.product_and_service) {
        this.product_and_service.setValue(this.model.product_and_service);
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
    model.office = this.model.office.id;
    model.product_and_service = this.model.product_and_service.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/rates']);
          } else {
            this.router.navigate(['/rates']);
          }
        }
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
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.rate
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    
    let model = this.model;
    model.office = this.model.office.id;
    model.product_and_service = this.model.product_and_service.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/rates']);
          } else {
            this.router.navigate(['/rates']);
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
      this.model = response.crew as Model
    });
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.ngOnInit();
  }
  ngOnDestroy() {
    // this.subscriptions.forEach(sb => sb.unsubscribe());
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
        // this.company.setValue(response.company)
      },
      error => {
        console.log('error getting company');
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
