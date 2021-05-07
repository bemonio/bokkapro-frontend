import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { VoucherModel as Model } from '../../_models/voucher.model';
import { VoucherService as ModelsService } from '../../_services/voucher.service';
import { CompanyService } from 'src/app/pages/company/_services';
import { OfficeService } from 'src/app/pages/office/_services';
import { LocationService } from 'src/app/pages/location/_services';

@Component({
  selector: 'app-voucher-edit',
  templateUrl: './voucher-edit.component.html',
  styleUrls: ['./voucher-edit.component.scss']
})
export class VoucherEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean;

  public tabs = {
    BASIC_TAB: 0,
    PACKINGS_TAB: 1,
  };

  public code: AbstractControl;
  public amount: AbstractControl;
  public count_packings: AbstractControl;
  public verificated: AbstractControl;
  public packings: AbstractControl;
  public company: AbstractControl;
  public location_origin: AbstractControl;
  public location_destination: AbstractControl;
  public currency: AbstractControl;

  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

  public guideId: number;
  public parent: string;

  public division: any;
  public office: any;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private companyService: CompanyService,
    private locationService: LocationService,
    private officeService: OfficeService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      amount: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      count_packings: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      verificated: [''],
      packings: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      company: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      location_origin: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      location_destination: ['', Validators.compose([Validators.minLength(1)])],
      currency: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.code = this.formGroup.controls['code'];
    this.amount = this.formGroup.controls['amount']
    this.count_packings = this.formGroup.controls['count_packings']
    this.verificated = this.formGroup.controls['verificated'];
    this.packings = this.formGroup.controls['packings'];
    this.company = this.formGroup.controls['company']
    this.location_origin = this.formGroup.controls['location_origin']
    this.location_destination = this.formGroup.controls['location_destination']
    this.currency = this.formGroup.controls['currency']
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.division = this.authService.currentDivisionValue;
    this.getOfficeById(this.division.office);

    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.guideId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.guideId;
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
        return of({ 'voucher': new Model() });
      }),
      catchError((error) => {
        let messageError = [];
        if (!Array.isArray(error.error)) {
          messageError.push(error.error);
        } else {
          messageError = error.error;
        }
        Object.entries(messageError).forEach(
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of({ 'voucher': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.voucher;
        if (response.companies) {
          this.model.company = response.companies[0];
        }
        if (response.guides) {
          this.model.guides = response.guides[0];
        }
        if (response.packings) {
          this.model.packings = response.packings;
        }
        if (response.currencies) {
          this.model.currency = response.currencies[0];
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
      this.amount.setValue(this.model.amount);
      this.count_packings.setValue(this.model.count_packings);
      this.verificated.setValue(this.model.verificated);
      if (this.model.company) {
        this.company.setValue(this.model.company);
      }
      if (this.model.location_origin) {
        this.location_origin.setValue(this.model.location_origin);
      }
      if (this.model.location_destination) {
        this.location_destination.setValue(this.model.location_destination);
      }
      if (this.model.currency) {
        this.currency.setValue(this.model.currency);
      }
      if (this.model.packings) {
        let list_packings = [];
        this.model.packings.forEach(element => {
          list_packings.push(element.code);
        });
        this.packings.setValue(list_packings);
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
    model.company = this.model.company.id;
    model.location_origin = this.model.location_origin.id;
    model.location_destination = this.model.location_destination.id;
    model.currency = this.model.currency.id;
    model.division = this.division.id;
    model.verificated = true;
    model.guides = this.guideId;
    model.packings = undefined;

    // let packings = [];
    // this.model.packings.forEach(element => {
    //   packings.push(element);
    // });
    // model.packings = packings;

    // let guides = [];
    // guides.push(this.guideId);
    // model.guides = guides;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate([this.parent + '/vouchers']);
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.voucher
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.company = this.model.company.id;
    model.location_origin = this.model.location_origin.id;
    model.location_destination = this.model.location_destination.id;
    model.currency = this.model.currency.id;
    model.division = this.division.id;
    model.verificated = true;

    let packings = [];
    this.model.packings.forEach(element => {
      packings.push({ 'code': element, 'verificated': 'true' });
    });
    model.packings = packings;

    let guides = [];
    guides.push(this.guideId);
    model.guides = guides;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
      }),
      catchError((error) => {
        if (Array.isArray(error.error)) {
          let messageError = [];
          if (!Array.isArray(error.error)) {
            messageError.push(error.error);
          } else {
            messageError = error.error;
          }
          Object.entries(messageError).forEach(
            ([key, value]) => this.toastService.growl('error', key + ': ' + value)
          );
        } else {
          this.toastService.growl('error', error.error)
        }
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.voucher as Model
      if (this.saveAndExit) {
        this.router.navigate([this.parent + '/vouchers']);
      } else {
        this.formGroup.reset()
      }
    });
    // this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
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

  public changeCountPackings() {
    this.packings.setValidators(Validators.compose([Validators.required, Validators.minLength(this.count_packings.value), Validators.maxLength(this.count_packings.value)]));
    this.formGroup.markAllAsTouched();
  }

  public changeCompany() {
    this.location_origin.reset();
    this.formGroup.markAllAsTouched();
  }

  public changeLocationOrigin() {
    this.company.reset();
    this.formGroup.markAllAsTouched();
    if (this.location_origin.value) {
      this.getCompanyById(this.location_origin.value.company);
      this.getLocationDestinationByCompanyId(this.location_origin.value.company)
    }
  }

  getCompanyById(id) {
    this.companyService.getById(id).toPromise().then(
      response => {
        this.company.setValue(response.company)
      },
      error => {
        console.log('error getting company');
      }
    );
  }

  getLocationDestinationByCompanyId(id) {
    let page = 1;
    let per_page = 10; 
    let sort = '-id';
    let query = '';
    let filters = [];
    let _with = undefined;

    filters.push({ key: 'filter{company}', value: id })

    this.locationService.get(page, per_page, sort, query, filters, _with).toPromise().then(
      response => {
        if (response.locations.length == 1) {
          this.location_destination.setValue(response.locations[0])
        }
      },
      error => {
        console.log('error getting location');
      }
    );
  }

  getOfficeById(id) {
    this.officeService.getById(id).toPromise().then(
      response => {
        this.office = response.office;
        if (response.currencies) {
          this.office.currency = response.currencies[0];
        }
        if (response.companies) {
          this.office.company = response.companies[0];
        }
        if (this.model) {
          if (!this.model.id) {
            this.currency.setValue(this.office.currency);
          }
        } else {
          this.currency.setValue(this.office.currency);
        }
      },
      error => {
        console.log('error getting office');
      }
    );
  }
}
