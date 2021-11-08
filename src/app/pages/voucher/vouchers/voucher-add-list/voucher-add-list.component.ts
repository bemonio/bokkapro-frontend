import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { VoucherListModel as Model } from '../../_models/voucher-list.model';
import { VoucherService as ModelsService } from '../../_services/voucher.service';
import { OfficeService } from 'src/app/pages/office/_services';
import { LocationService } from 'src/app/pages/location/_services';
import { ContractService } from 'src/app/pages/contract/_services';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher-add-list',
  templateUrl: './voucher-add-list.component.html',
  styleUrls: ['./voucher-add-list.component.scss']
})
export class VoucherAddListComponent implements OnInit, OnDestroy {
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

  public code_start: AbstractControl;
  public code_end: AbstractControl;
  public verificated: AbstractControl;
  public contract: AbstractControl;
  public is_active: AbstractControl;
  
  public activeTabId: number;

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
      code_start: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      code_end: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      verificated: [''],
      contract: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      is_active: [''],
    });
    this.code_start = this.formGroup.controls['code_start'];
    this.code_end = this.formGroup.controls['code_end'];
    this.verificated = this.formGroup.controls['verificated'];
    this.contract = this.formGroup.controls['contract'];
    this.is_active = this.formGroup.controls['is_active'];

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
        if (response.contracts) {
          this.model.contract = response.contracts[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    this.verificated.setValue(false);
    this.is_active.setValue(true);

    if (this.model.id) {
      this.editBool = true;
      this.code_start.setValue(this.model.code_start);
      this.code_end.setValue(this.model.code_end);
      this.verificated.setValue(this.model.verificated);
      this.is_active.setValue(this.model.is_active);
      if (this.model.contract) {
        this.contract.setValue(this.model.contract);
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
      this.create();
    }
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.code_start = this.model.code_start.replace(/[^a-zA-Z0-9]/g, '')
    model.code_end = this.model.code_end.replace(/[^a-zA-Z0-9]/g, '')
    model.contract = this.model.contract.id;

    model.division = this.division.id;
    model.verificated = false;

    const sbCreate = this.modelsService.postList(model).pipe(
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

  public closeEmit() {
    this.close.emit(true);
    this.loadForm();
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
