import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
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
import { ContractService } from 'src/app/pages/contract/_services';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher-edit',
  templateUrl: './voucher-edit.component.html',
  styleUrls: ['./voucher-edit.component.scss']
})
export class VoucherEditComponent implements OnInit, OnDestroy {
  @Input() showCashier: boolean;
  @Input() showCertifiedCart: boolean;
  @Input() listVouchers: any[];
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    PACKINGS_TAB: 1,
    GUIDES_TAB: 2,
  };

  public code: AbstractControl;
  public amount: AbstractControl;
  public count_packings: AbstractControl;
  public verificated: AbstractControl;
  public date_delivery: AbstractControl;
  public pickup_date: AbstractControl;
  public checkin_date: AbstractControl;
  public packings: AbstractControl;
  public company: AbstractControl;
  public cashier: AbstractControl;
  public contract: AbstractControl;
  public origin_destination: AbstractControl; 
  public location_origin: AbstractControl;
  public location_destination: AbstractControl;
  public direct_operation: AbstractControl;
  public is_active: AbstractControl;
  public verified_oi: AbstractControl;
  public currency: AbstractControl;
  public certified_cart: AbstractControl;
  
  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;
  public editBool: boolean;

  public guideId: number;
  public parent: string;

  public division: any;
  public office: any;

  public confirmDialogPosition: string;
  public message_facture_voucher_and_packings: string;
  public message_verification_voucher: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private companyService: CompanyService,
    private locationService: LocationService,
    private contractService: ContractService,
    private officeService: OfficeService,
    private confirmationService: ConfirmationService,
    public translate: TranslateService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;
    this.editBool = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      amount: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      count_packings: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      verificated: [''],
      date_delivery: [''],
      pickup_date: [''],
      checkin_date: [''],
      packings: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      company: [''],
      cashier: [''],
      contract: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      origin_destination: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      location_origin: [''],
      location_destination: [''],
      direct_operation: [''],
      is_active: [''],
      verified_oi: [''],
      currency: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      certified_cart: [''] 
    });
    this.code = this.formGroup.controls['code'];
    this.amount = this.formGroup.controls['amount'];
    this.count_packings = this.formGroup.controls['count_packings'];
    this.verificated = this.formGroup.controls['verificated'];
    this.date_delivery = this.formGroup.controls['date_delivery'];
    this.pickup_date = this.formGroup.controls['pickup_date'];
    this.checkin_date = this.formGroup.controls['checkin_date'];
    this.packings = this.formGroup.controls['packings'];;
    this.company = this.formGroup.controls['company'];
    this.cashier = this.formGroup.controls['cashier'];
    this.contract = this.formGroup.controls['contract'];
    this.origin_destination = this.formGroup.controls['origin_destination'];
    this.location_origin = this.formGroup.controls['location_origin'];
    this.location_destination = this.formGroup.controls['location_destination'];
    this.currency = this.formGroup.controls['currency'];
    this.certified_cart = this.formGroup.controls['certified_cart'];
    this.direct_operation = this.formGroup.controls['direct_operation'];
    this.is_active = this.formGroup.controls['is_active'];
    this.verified_oi = this.formGroup.controls['verified_oi'];
    this.currency = this.formGroup.controls['currency']

    this.confirmDialogPosition = 'center';

    this.translate.get('COMMON.MESSAGE_FACTURE_VOUCHER_AND_PACKINGS').subscribe((res: string) => {
        this.message_facture_voucher_and_packings = res;
    });

    this.translate.get('COMMON.MESSAGE_VERIFICATION_VOUCHER').subscribe((res: string) => {
        this.message_verification_voucher = res;
    });
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
        if (response.contracts) {
          this.model.contract = response.contracts[0];
        }
        if (response.origin_destinations) {
          this.model.origin_destination = response.origin_destinations[0];
        }
        if (response.cashier) {
          this.model.cashier = response.cashier[0];
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
        if (response.certified_cart) {
          this.model.certified_cart = response.certified_cart[0];
        }

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    this.verificated.setValue(false);
    this.direct_operation.setValue(false);
    this.is_active.setValue(true);
    this.verified_oi.setValue(false);
    this.date_delivery.setValue(undefined)
    this.pickup_date.setValue(undefined)
    this.checkin_date.setValue(undefined)

    if (this.model.id) {
      this.editBool = true;
      this.code.setValue(this.model.code);
      this.amount.setValue(this.model.amount);
      this.count_packings.setValue(this.model.count_packings);
      this.verificated.setValue(this.model.verificated);
      this.model.date_delivery != undefined ? this.date_delivery.setValue(new Date(this.formatDate(this.model.date_delivery))) : undefined;
      this.model.pickup_date != undefined ? this.pickup_date.setValue(new Date(this.formatDate(this.model.pickup_date))) : undefined;
      this.model.checkin_date != undefined ? this.checkin_date.setValue(new Date(this.formatDate(this.model.checkin_date))) : undefined;
      this.direct_operation.setValue(this.model.direct_operation);
      this.is_active.setValue(this.model.is_active);
      this.verified_oi.setValue(this.model.verified_oi);
      if (this.model.company) {
        this.company.setValue(this.model.company);
      }
      if (this.model.cashier) {
        this.cashier.setValue(this.model.cashier);
      }
      if (this.model.contract) {
        this.contract.setValue(this.model.contract);
      }
      if (this.model.origin_destination) {
        this.origin_destination.setValue(this.model.origin_destination);
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
      if (this.model.certified_cart) {
        this.certified_cart.setValue(this.model.certified_cart);
      }
      if (this.model.packings) {
        let list_packings = [];
        this.model.packings.forEach(element => {
          list_packings.push(element.code);
        });
        this.packings.setValue(list_packings);
      }
    }

    if(this.showCashier){
        this.cashier.setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
        this.code.setValidators([]);
        this.amount.setValidators([]);
        this.count_packings.setValidators([]);
        this.verificated.setValidators([]);
        this.packings.setValidators([]);
        this.company.setValidators([]);
        this.contract.setValidators([]);
        this.origin_destination.setValidators([]);
        this.location_origin.setValidators([]);
        this.location_destination.setValidators([]);
        this.currency.setValidators([]);
        this.certified_cart.setValidators([]);
    }

    if(this.showCertifiedCart){
      this.cashier.setValidators([]);
      this.code.setValidators([]);
      this.amount.setValidators([]);
      this.count_packings.setValidators([]);
      this.verificated.setValidators([]);
      this.packings.setValidators([]);
      this.company.setValidators([]);
      this.contract.setValidators([]);
      this.contract.setValidators([]);
      this.location_origin.setValidators([]);
      this.location_destination.setValidators([]);
      this.currency.setValidators([]);
      this.certified_cart.setValidators([]);
      this.direct_operation.setValidators([])
      this.is_active.setValidators([])
      this.verified_oi.setValidators([])
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
      } else if (!this.listVouchers){
        this.create();
      } else if (this.showCashier) {
        this.asignCashier();
      } else if (this.showCertifiedCart) {
        this.asignCertifiedCart();
      }
    }
  }

  asignCashier(){
    let params = {
      cashierId: this.cashier.value.id,
      vouchers: this.listVouchers
    }
    const sbUpdate = this.modelsService.asignCashier(params).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        this.cashier.reset();
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
      this.closeEmit()
    });
  }

  asignCertifiedCart(){
    let params = {
      certifiedCartId: this.certified_cart.value,
      division: this.division.id.toString(),
      vouchers: this.listVouchers
    }
    const sbUpdate = this.modelsService.asignCertifiedCart(params).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        this.certified_cart.reset();
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
      this.closeEmit()
    });
  }

  edit() {
    this.requesting = true;
    let model = this.model;
    model.code = this.model.code.replace(/[^a-zA-Z0-9]/g, '')
    model.company = this.model.company.id;
    model.cashier = this.model.cashier.id;
    model.contract = this.model.contract.id;
    model.origin_destination = this.model.origin_destination.id;
    model.location_origin = this.model.location_origin.id;
    this.date_delivery.value != null ? model.date_delivery = this.formatDate(this.date_delivery.value) : model.date_delivery = this.date_delivery.value;
    this.pickup_date.value != null ? model.pickup_date = this.formatDate(this.pickup_date.value) : model.pickup_date = this.pickup_date.value;
    this.checkin_date.value != null ? model.checkin_date = this.formatDate(this.checkin_date.value) : model.checkin_date = this.checkin_date.value;

    this.model.location_destination 
    ? model.location_destination = this.model.location_destination.id 
    : model.location_destination = null;

    model.currency = this.model.currency.id;

    this.model.certified_cart = null;

    model.division = this.division.id;
    // model.verificated = true;
    model.guides = undefined;
    model.packings = undefined;

    // let packings = [];
    // this.model.packings.forEach(element => {
    //   packings.push(element);
    // });
    // model.packings = packings;

    // let guides = [];
    // guides.push(this.guideId);
    // model.guides = guides;

    let listVouchers = model.vouchers;
    model.vouchers = [];

    if (listVouchers) {
      listVouchers.forEach(element => {
        model.vouchers.push(element.id);
      });
    }

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/vouchers']);
          } else {
            this.router.navigate(['/vouchers']);
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
    model.code = this.model.code.replace(/[^a-zA-Z0-9]/g, '')
    model.company = this.model.company.id;
    model.cashier = this.model.cashier.id;
    model.contract = this.model.contract.id;
    model.origin_destination = this.model.origin_destination.id;
    model.location_origin = this.model.location_origin.id;

    model.date_delivery = undefined;
    if (this.date_delivery.value) {
      model.date_delivery = this.formatDate(this.date_delivery.value);
    }
    model.pickup_date = undefined;
    if (this.pickup_date.value) {
      model.pickup_date = this.formatDate(this.pickup_date.value);
    }
    model.checkin_date = undefined;
    if (this.checkin_date.value) {
      model.checkin_date = this.formatDate(this.checkin_date.value);
    }

    this.model.location_destination 
    ? model.location_destination = this.model.location_destination.id 
    : model.location_destination = null;

    model.currency = this.model.currency.id;

    this.model.certified_cart = null;

    model.division = this.division.id;
    // model.verificated = true;

    let packings = [];
    this.model.packings.forEach(element => {
      packings.push({ 'code': element.replace(/[^a-zA-Z0-9]/g, '')});
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
        if(this.parent){
          this.router.navigate([this.parent + '/vouchers']);
        } else {
          this.router.navigate(['/vouchers']);
        }
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
    this.contract.reset();
    this.origin_destination.reset();
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

  public changeContract () {
    this.origin_destination.reset();
    this.formGroup.markAllAsTouched();
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

  public closeEmit() {
    this.close.emit(true);
    this.loadForm();
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
        if (response.certified_carts) {
          this.office.certified_cart = response.certified_carts[0];
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

  changeRequiredLocation () {
    if (this.direct_operation.value === true) {
      this.location_destination.setValidators(Validators.compose([Validators.required, Validators.minLength(1)]));
      if (this.location_destination.value) {
        let model = this.model;
        model.location_destination = this.location_destination.value;
      } else {
        this.location_destination.setValue(undefined);
      }
    } else {
      this.location_destination.setValidators([]);
      if (this.location_destination.value) {
        let model = this.model;
        model.location_destination = this.location_destination.value;
      } else {
        this.location_destination.setValue(undefined);
      }
    }
  }
  
  public verification(position: string) {
    this.confirmDialogPosition = position;
    if(this.direct_operation.value === true){
      this.confirmationService.confirm({
          message: this.message_facture_voucher_and_packings,
          accept: () => {
              this.asiconfirmVerification();
          }
      });
    } else {
      this.confirmationService.confirm({
          message: this.message_verification_voucher,
          accept: () => {
              this.asiconfirmVerification();
          }
      });
    }
  }

  asiconfirmVerification(){
    let params = []
    if (this.direct_operation.value === true) {
      params.push({
        is_active: false,
        verified_oi: true,
      })
    } else {
      params.push({
        verified_oi: true,
      })
    }
    const sbUpdate = this.modelsService.patch(this.id, params[0]).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if(this.parent){
          this.router.navigate([this.parent + '/vouchers']);
        } else {
          this.router.navigate(['/vouchers']);
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
      this.closeEmit()
    });
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

    return [year, month, day].join('-') + ' ' + [hours, minutes].join(':');
  }

}
