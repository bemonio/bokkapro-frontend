import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { PackingModel as Model } from '../../_models/packing.model';
import { PackingService as ModelsService } from '../../_services/packing.service';
import { VoucherService } from 'src/app/pages/voucher/_services';

@Component({
  selector: 'app-packing-edit',
  templateUrl: './packing-edit.component.html',
  styleUrls: ['./packing-edit.component.scss']
})
export class PackingEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    DEPOSITFORM_TAB: 1,
  };

  public code: AbstractControl;
  public verificated: AbstractControl;
  public voucher_current: AbstractControl;

  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';

  public displayModal: boolean;
  public newLogo: boolean;

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  public voucherId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private voucherService: VoucherService,
    private toastService: ToastService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      verificated: [''],
      voucher_current: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
    });
    this.code = this.formGroup.controls['code'];
    this.verificated = this.formGroup.controls['verificated'];
    this.voucher_current = this.formGroup.controls['voucher_current'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.newLogo = false;
    this.displayModal = false;

    if (this.route.parent.parent.parent.snapshot.url.length > 0) {
      this.route.parent.parent.parent.params.subscribe((params) => {
          if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
              let params1 = params.id;
              this.voucherId = params1;
              this.getVoucherById(params1);

              if (this.route.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                  this.route.parent.parent.parent.parent.parent.parent.params.subscribe((params) => {
                      let params2 = params.id;

                      if (this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                          this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.params.subscribe((params) => {
                              let params3 = params.id;
  
                              if (this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                                  this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params3;
                                  this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                                  this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                              }
                          })
                      } else {
                        this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                        this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                      }
                  })
              } else {
                  this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
              }
          }
          this.get();
      });
    } else {
        this.get();
    }
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
        return of({ 'packing': new Model() });
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
        return of({ 'packing': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.packing;
        if (response.vouchers) {
          response.vouchers.forEach(voucher => {
            if (this.model.voucher_current == voucher.id) {
              this.model.voucher_current = voucher
            }
          });
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
      this.verificated.setValue(this.model.verificated);
      if (this.model.voucher_current) {
        this.voucher_current.setValue(this.model.voucher_current);
      }
    } else {
      this.verificated.setValue(false);
      if (this.voucherId) {
        this.getVoucherById(this.voucherId);
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
    model.code = this.model.code.replace(/[^a-zA-Z0-9]/g, '');
    model.voucher_current = this.model.voucher_current.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/packings']);
          } else {
            this.router.navigate(['/packings']);
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

    this.model = response.packing
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.code = this.model.code.replace(/[^a-zA-Z0-9]/g, '');

    if (this.voucherId) {
      model.voucher_current = this.voucherId;
    } else {
      model.voucher_current = this.model.voucher_current.id;
    }

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/packings']);
          } else {
            this.router.navigate(['/packings']);
          }
        } else {
          this.formGroup.reset()
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
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.packing as Model
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

  getVoucherById(id) {
    this.voucherService.getById(id).toPromise().then(
      response => {
        this.voucher_current.setValue(response.voucher)
      },
      error => {
        console.log('error getting voucher');
      }
    );
  }
}
