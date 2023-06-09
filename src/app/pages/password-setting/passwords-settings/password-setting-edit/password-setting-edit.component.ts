import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { PasswordSettingModel as Model } from '../../_models/password-setting.model';
import { PasswordSettingService as ModelsService } from '../../_services/password-setting.service';

@Component({
  selector: 'app-password-setting-edit',
  templateUrl: './password-setting-edit.component.html',
  styleUrls: ['./password-setting-edit.component.scss']
})
export class PasswordSettingEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public password_change_frequency_days: AbstractControl;
  public password_expiry_notification: AbstractControl;
  public password_expiry_notification_days: AbstractControl;
  public failed_login_attempts: AbstractControl;
  public min_password_length: AbstractControl;
  public max_password_length: AbstractControl;
  public previous_passwords_disallowed: AbstractControl;
  public password_reset_required: AbstractControl;
  public complex_password_required: AbstractControl;
  public min_lowercase_chars: AbstractControl;
  public min_uppercase_chars: AbstractControl;
  public min_numeric_chars: AbstractControl;
  public min_special_chars: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

    this.formGroup = this.fb.group({
      password_change_frequency_days: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      password_expiry_notification: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      password_expiry_notification_days: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      failed_login_attempts: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      min_password_length: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      max_password_length: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      previous_passwords_disallowed: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      password_reset_required: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      complex_password_required: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      min_lowercase_chars: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      min_uppercase_chars: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      min_numeric_chars: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      min_special_chars: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
    });
    this.password_change_frequency_days = this.formGroup.controls['password_change_frequency_days'];
    this.password_expiry_notification = this.formGroup.controls['password_expiry_notification'];
    this.password_expiry_notification_days = this.formGroup.controls['password_expiry_notification_days'];
    this.failed_login_attempts = this.formGroup.controls['failed_login_attempts'];
    this.min_password_length = this.formGroup.controls['min_password_length'];
    this.max_password_length = this.formGroup.controls['max_password_length'];
    this.previous_passwords_disallowed = this.formGroup.controls['previous_passwords_disallowed'];
    this.password_reset_required = this.formGroup.controls['password_reset_required'];
    this.complex_password_required = this.formGroup.controls['complex_password_required'];
    this.min_lowercase_chars = this.formGroup.controls['min_lowercase_chars'];
    this.min_uppercase_chars = this.formGroup.controls['min_uppercase_chars'];
    this.min_numeric_chars = this.formGroup.controls['min_numeric_chars'];
    this.min_special_chars = this.formGroup.controls['min_special_chars'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.get();

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
        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'password_settings': new Model() });
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
        return of({ 'password_settings': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.password_setting;
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.password_change_frequency_days.setValue(this.model.password_change_frequency_days);
      this.password_expiry_notification.setValue(this.model.password_expiry_notification);
      this.password_expiry_notification_days.setValue(this.model.password_expiry_notification_days);
      this.failed_login_attempts.setValue(this.model.failed_login_attempts);
      this.min_password_length.setValue(this.model.min_password_length);
      this.max_password_length.setValue(this.model.max_password_length);
      this.previous_passwords_disallowed.setValue(this.model.previous_passwords_disallowed);
      this.password_reset_required.setValue(this.model.password_reset_required);
      this.complex_password_required.setValue(this.model.complex_password_required);
      this.min_lowercase_chars.setValue(this.model.min_lowercase_chars);
      this.min_uppercase_chars.setValue(this.model.min_uppercase_chars);
      this.min_numeric_chars.setValue(this.model.min_numeric_chars);
      this.min_special_chars.setValue(this.model.min_special_chars); 
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
    const sbUpdate = this.modelsService.patch(this.id, this.model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/passwordssettings']);
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
      this.model = response.password_setting
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    const sbCreate = this.modelsService.post(this.model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/passwordssettings']);
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
      this.model = response.password_setting as Model
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
}
