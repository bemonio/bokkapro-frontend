import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { PackageModel as Model } from '../../_models/package.model';
import { PackageService as ModelsService } from '../../_services/package.service';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss']
})
export class PackageEditComponent implements OnInit, OnDestroy {
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
  public verificated: AbstractControl;

  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {  
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.loading = false;
  
    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      verificated: [''],
    });
    this.code = this.formGroup.controls['code'];
    this.verificated = this.formGroup.controls['verificated'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.get();
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
        return of({'package':new Model()});
      }),
      catchError((error) => {
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of({'package':new Model()});
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.model = response.package;
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

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/packages']);
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
      this.model = response.package
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.loading = true;
    let model = this.model;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/packages']);
        }
      }),
      catchError((error) => {
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.package as Model
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
}
