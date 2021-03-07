import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { TypeCompanyModel } from 'src/app/pages/type-company/_models/type-company.model';
import { CompanyModel as Model } from '../../_models/company.model';
import { CompanyService as ModelsService } from '../../_services/company.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean;

  public tabs = {
    BASIC_TAB: 0,
    OFFICE_TAB: 1,
  };

  public code: AbstractControl;
  public code_brinks: AbstractControl;
  public identification_number: AbstractControl;
  public name: AbstractControl;
  public alias: AbstractControl;
  public abbreviation: AbstractControl;
  public logo: AbstractControl;
  public email: AbstractControl;
  public phone: AbstractControl;
  public web: AbstractControl;
  public address: AbstractControl;
  public name_invoce_to: AbstractControl;
  public is_carrier: AbstractControl;
  public is_financial_institution: AbstractControl;
  public is_active: AbstractControl;
  public segment_company: AbstractControl;
  public type_company: AbstractControl;

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

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      code_brinks: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      identification_number: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      alias: [''],
      abbreviation: [''],
      logo: [''],
      email: [''],
      phone: [''],
      web: [''],
      address: [''],
      name_invoce_to: [''],
      is_carrier: [''],
      is_financial_institution: [''],
      is_active: [''],
      segment_company: ['', Validators.compose([Validators.required])],
      type_company: ['', Validators.compose([Validators.required])],
    });
    this.code = this.formGroup.controls['code'];
    this.code_brinks = this.formGroup.controls['code_brinks'];
    this.identification_number = this.formGroup.controls['identification_number'];
    this.name = this.formGroup.controls['name'];
    this.alias = this.formGroup.controls['alias'];
    this.abbreviation = this.formGroup.controls['abbreviation'];
    this.logo = this.formGroup.controls['logo'];
    this.email = this.formGroup.controls['email'];
    this.phone = this.formGroup.controls['phone'];
    this.web = this.formGroup.controls['web'];
    this.address = this.formGroup.controls['address'];
    this.name_invoce_to = this.formGroup.controls['name_invoce_to'];
    this.is_carrier = this.formGroup.controls['is_carrier'];
    this.is_financial_institution = this.formGroup.controls['is_financial_institution'];
    this.is_active = this.formGroup.controls['is_active'];
    this.segment_company = this.formGroup.controls['segment_company'];
    this.type_company = this.formGroup.controls['type_company'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.newLogo = false;
    this.displayModal = false;

    this.get();
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
        return of({ 'company': new Model() });
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
        return of({ 'company': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.company;
        if (response.type_companies)
          this.model.type_company = response.type_companies[0];
        if (response.segment_companies)
          this.model.segment_company = response.segment_companies[0];
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.code.setValue(this.model.code);
      this.code_brinks.setValue(this.model.code_brinks);
      this.identification_number.setValue(this.model.identification_number);
      this.name.setValue(this.model.name);
      this.alias.setValue(this.model.alias);
      this.abbreviation.setValue(this.model.abbreviation);
      this.logo.setValue(this.model.logo);
      this.email.setValue(this.model.email);
      this.phone.setValue(this.model.phone);
      this.web.setValue(this.model.web);
      this.address.setValue(this.model.address);
      this.name_invoce_to.setValue(this.model.name_invoce_to);
      this.is_carrier.setValue(this.model.is_carrier);
      this.is_financial_institution.setValue(this.model.is_financial_institution);
      this.is_active.setValue(this.model.is_active);
      this.is_active.setValue(this.model.is_active);
      if (this.model.segment_company) {
        this.segment_company.setValue(this.model.segment_company);
      }
      if (this.model.type_company) {
        this.type_company.setValue(this.model.type_company);
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
    model.segment_company = this.model.segment_company.id;
    model.type_company = this.model.type_company.id;
    // model.logo = this.croppedImage;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/companies']);
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
      this.model = response.company
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.segment_company = this.model.segment_company.id;
    model.type_company = this.model.type_company.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/companies']);
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.company as Model
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

  fileChangeEvent(event: any): void {
    this.requesting = true;
    this.imageChangedEvent = event;
    this.showModalDialog();
    this.newLogo = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  deleteLogo() {
    this.newLogo = false;
  }

  cancelLogo() {
    this.newLogo = false;
    this.logo.setValue('');
  }

  showModalDialog() {
    this.displayModal = true;
    this.requesting = false;
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }
}
