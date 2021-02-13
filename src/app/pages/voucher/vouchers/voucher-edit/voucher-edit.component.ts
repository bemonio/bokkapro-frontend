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
  public loading: boolean;

  public tabs = {
    BASIC_TAB: 0,
    OFFICE_TAB: 1,
  };

  public code: AbstractControl;
  public amount: AbstractControl;
  public count_packages: AbstractControl;
  public verificated: AbstractControl;
  public packages: AbstractControl;
  public company: AbstractControl;
  public location_origin: AbstractControl;
  public location_destination: AbstractControl;

  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

  public guideId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService
  ) {  
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.loading = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      amount: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      count_packages: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      verificated: [''],
      packages: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      company: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      location_origin: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      location_destination: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.code = this.formGroup.controls['code'];
    this.amount = this.formGroup.controls['amount']
    this.count_packages = this.formGroup.controls['count_packages']
    this.verificated = this.formGroup.controls['verificated'];
    this.packages = this.formGroup.controls['packages'];
    this.company = this.formGroup.controls['company']
    this.location_origin = this.formGroup.controls['location_origin']
    this.location_destination = this.formGroup.controls['location_destination']
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.route.parent.parent.parent.params.subscribe((params) => { 
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.guideId = params.id;
        this.parent = '/'+ this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.guideId;
      }
      this.get();
    });
  }

  get() {
    this.loading = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));

        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({'voucher':new Model()});
      }),
      catchError((error) => {
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of({'voucher':new Model()});
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.model = response.voucher;
        if (response.companies) {
          this.model.company = response.companies[0];
        }
        if (response.guides) {
          this.model.guides = response.guides[0];
        }
        if (response.packages) {
          this.model.packages = response.packages;
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
      this.count_packages.setValue(this.model.count_packages);
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
      if (this.model.packages) {
        let list_packages = [];
        this.model.packages.forEach(element => {
            list_packages.push(element.code);
        });
        this.packages.setValue(list_packages);
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
    this.loading = true;
    let model = this.model;
    model.company = this.model.company.id;
    model.location_origin = this.model.location_origin.id;
    model.location_destination = this.model.location_destination.id;
    model.division = this.authService.currentDivisionValue.id;
    model.verificated = true;

    let packages = [];
    this.model.packages.forEach(element => {
      packages.push({'code': element, 'verificated': 'true'});
    });
    model.packages = packages;

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
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
       return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.voucher
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.loading = true;
    let model = this.model;
    model.company = this.model.company.id;
    model.location_origin = this.model.location_origin.id;
    model.location_destination = this.model.location_destination.id;
    model.division = this.authService.currentDivisionValue.id;
    model.verificated = true;

    let packages = [];
    this.model.packages.forEach(element => {
      packages.push({'code': element, 'verificated': 'true'});
    });
    model.packages = packages;

    let guides = [];
    guides.push(this.guideId);
    model.guides = guides;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
      }),
      catchError((error) => {
        if (Array.isArray(error.error)) {
          Object.entries(error.error).forEach(
            ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
          );
        } else {
          this.toastService.growl('error', error.error)
        }
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.voucher as Model
      if (this.saveAndExit) {
        this.router.navigate([this.parent + '/vouchers']);
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
}
