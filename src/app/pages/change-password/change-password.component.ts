import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel as UserModel } from '../user/_models/user.model';
import { UserService as UserService } from '../user/_services/user.service';

import { AuthService } from 'src/app/modules/auth';

import { ToastService } from 'src/app/modules/toast/_services/toast.service';

import { catchError, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { PasswordSettingModel as PasswordSettingModel } from '../password-setting/_models/password-setting.model';
import { PasswordSettingService as PasswordSettingService } from '../password-setting/_services/password-setting.service';

import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: any;
  firstUserState: any;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;

  public password_setting: PasswordSettingModel;

  public current_password: AbstractControl;
  public new_password: AbstractControl;
  public verify_password: AbstractControl;

  public saveAndExit;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private passwordSettingService: PasswordSettingService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router,
    ) {
    this.isLoading$ = this.authService.isLoadingSubject.asObservable();
    this.saveAndExit = false;

    this.password_setting = new PasswordSettingModel();
    this.password_setting.password_change_frequency_days = 30;
    this.password_setting.password_expiry_notification = true;
    this.password_setting.password_expiry_notification_days = 5;
    this.password_setting.failed_login_attempts = 5;
    this.password_setting.min_password_length = 8;
    this.password_setting.max_password_length = 12;
    this.password_setting.previous_passwords_disallowed = 8;
    this.password_setting.password_reset_required = true;
    this.password_setting.complex_password_required = true;
    this.password_setting.min_lowercase_chars = 1;
    this.password_setting.min_uppercase_chars = 1;
    this.password_setting.min_numeric_chars = 1;
    this.password_setting.min_special_chars = 0;
  }

  ngOnInit(): void {
    const sb = this.authService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = this.authService.currentUserValue;
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
    this.get_password_settings();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      current_password: ['',
        Validators.compose(
          [
            Validators.required,
          ]
        )
      ],
      new_password: ['',
        Validators.compose(
          [
            Validators.required,
            Validators.minLength(this.password_setting.min_password_length),
            Validators.maxLength(this.password_setting.max_password_length),
            Validators.pattern(`^(?=.*[a-z]{${this.password_setting.min_lowercase_chars},})(?=.*[A-Z]{${this.password_setting.min_uppercase_chars},})(?=.*\\d{${this.password_setting.min_numeric_chars},})(?=.*[^a-zA-Z\\d]{${this.password_setting.min_special_chars},}).+$`)
          ]
        )
      ],
      verify_password: ['',
        Validators.compose(
          [
            Validators.required,
          ]
        )
      ],
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
    this.current_password = this.formGroup.controls['current_password'];
    this.new_password = this.formGroup.controls['new_password'];
    this.verify_password = this.formGroup.controls['verify_password'];
  }

  save(saveAndExit) {
    this.saveAndExit = saveAndExit;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      this.edit()
    }
  }

  edit() {
    let model = {
      "id": this.authService.currentUserValue.id,
      "password":this.new_password.value,
      "oldpassword":this.current_password.value,
      "userprofile":this.authService.currentUserValue.user_profiles
    };
    let id = this.authService.currentUserValue.id;
    const sbUpdate = this.userService.patch(id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/dashboard']);
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
        return of(model);
      })
    ).subscribe(response => {
      // this.model = response.user
    });
    this.subscriptions.push(sbUpdate);
  }  

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
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

  get_password_settings() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        return this.passwordSettingService.getById(1);
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
        return of({ 'password_settings': new PasswordSettingModel() });
      }),
    ).subscribe((response: any) => {
      if (response) {
        this.password_setting = response.password_setting;
        this.new_password.setValidators(
          Validators.compose([
            Validators.required,
            Validators.minLength(this.password_setting.min_password_length),
            Validators.maxLength(this.password_setting.max_password_length),
            Validators.pattern(`^(.*[a-z]){${this.password_setting.min_lowercase_chars},}.*$`),
            Validators.pattern(`^(.*[A-Z]){${this.password_setting.min_uppercase_chars},}.*$`),
            Validators.pattern(`^(.*\\d){${this.password_setting.min_numeric_chars},}.*$`),
            Validators.pattern(`^(.*[^a-zA-Z\\d]){${this.password_setting.min_special_chars},}.*$`)
          ]));
        }
   });
    this.subscriptions.push(sb);
  }

  get newPasswordErrors() {
    const errors = this.new_password.errors;
    if (errors?.pattern) {
      const passwordValue = this.new_password.value;
      const errorObj: any = {};
  
      const lowercaseRegex = /[a-z]/;
      const uppercaseRegex = /[A-Z]/;
      const numericRegex = /\d/;
      const specialRegex = /[^a-zA-Z\d]/;
  
      const minLowercaseChars = this.password_setting.min_lowercase_chars;
      const minUppercaseChars = this.password_setting.min_uppercase_chars;
      const minNumericChars = this.password_setting.min_numeric_chars;
      const minSpecialChars = this.password_setting.min_special_chars;
  
      errorObj.requiredLowercase = minLowercaseChars > 0 && !lowercaseRegex.test(passwordValue);
      errorObj.requiredUppercase = minUppercaseChars > 0 && !uppercaseRegex.test(passwordValue);
      errorObj.requiredNumeric = minNumericChars > 0 && !numericRegex.test(passwordValue);
      errorObj.requiredSpecial = minSpecialChars > 0 && !specialRegex.test(passwordValue);
  
      return errorObj;
    }
  
    return null;
  }  
}
