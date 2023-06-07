import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { UserModel as Model } from '../../_models/user.model';
import { UserService as ModelsService } from '../../_services/user.service';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

import { PasswordSettingModel as PasswordSettingModel } from '../../../password-setting/_models/password-setting.model';
import { PasswordSettingService as PasswordSettingService } from '../../../password-setting/_services/password-setting.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    PROFILE: 1,
  };

  public username: AbstractControl;
  public first_name: AbstractControl;
  public last_name: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  // public user_permissions: AbstractControl;
  public groups: AbstractControl;
  public is_active: AbstractControl;
  public is_staff: AbstractControl;
  public is_superuser: AbstractControl;
  public avatar: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public view: boolean;

  public newAvatar: boolean;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  public displayModalAvatar: boolean;

  public password_setting: PasswordSettingModel;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private passwordSettingService: PasswordSettingService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

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

    this.formGroup = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      first_name: [''],
      last_name: [''],
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(255)])],
      password: ['',
        Validators.compose(
          [
            Validators.required,
            Validators.minLength(this.password_setting.min_password_length),
            Validators.maxLength(this.password_setting.max_password_length),
            Validators.pattern(`^(?=.*[a-z]{${this.password_setting.min_lowercase_chars},})(?=.*[A-Z]{${this.password_setting.min_uppercase_chars},})(?=.*\\d{${this.password_setting.min_numeric_chars},})(?=.*[^a-zA-Z\\d]{${this.password_setting.min_special_chars},}).+$`)
          ]
        )
      ],
      groups: [''],
      is_active: [''],
      is_staff: [''],
      is_superuser: [''],
      avatar: ['']
    })

    this.username = this.formGroup.controls['username'];
    this.first_name = this.formGroup.controls['first_name'];
    this.last_name = this.formGroup.controls['last_name'];
    this.email = this.formGroup.controls['email'];
    this.password = this.formGroup.controls['password'];
    // this.user_permissions = this.formGroup.controls['user_permissions'];
    this.groups = this.formGroup.controls['groups'];
    this.is_active = this.formGroup.controls['is_active'];
    this.is_staff = this.formGroup.controls['is_staff'];
    this.is_superuser = this.formGroup.controls['is_superuser'];
    this.avatar = this.formGroup.controls['avatar'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.get();
    this.get_password_settings();

    this.newAvatar = false;
    this.displayModalAvatar = false;

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
        return of({ 'user': new Model() });
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
        return of({ 'user': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.user;
        // if (response.permissions) {
        //   this.model.user_permissions = response.permissions;
        // }
        if (response.groups) {
          this.model.groups = response.groups;
        }
        if (response.user_profiles) {
          if (response.user_profiles[0]) {
            this.model.userprofile = response.user_profiles[0];
          }
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  get_password_settings() {
    this.requesting = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        return this.passwordSettingService.getById(1);
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
        return of({ 'password_settings': new PasswordSettingModel() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.password_setting = response.password_setting;
        this.password.setValidators(
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

  loadForm() {
    if (this.model.id) {
      this.username.setValue(this.model.username);
      this.first_name.setValue(this.model.first_name);
      this.last_name.setValue(this.model.last_name);
      this.email.setValue(this.model.email);
      this.password.setValue(this.model.password);
      this.is_active.setValue(this.model.is_active);
      this.is_staff.setValue(this.model.is_staff);
      this.is_superuser.setValue(this.model.is_superuser);
      // if (this.model.user_permissions) {
      //   this.user_permissions.setValue(this.model.user_permissions);
      // }
      if (this.model.groups) {
        this.groups.setValue(this.model.groups);
      }
    } else {
      this.is_active.setValue(false);
      this.is_staff.setValue(false);
      this.is_superuser.setValue(false);
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
    model.username = this.model.username;
    model.first_name = this.model.first_name;
    model.last_name = this.model.last_name;
    model.email = this.model.email;
    model.password = this.model.password;

    // let user_permissions = [];
    // if (this.model.user_permissions) {
    //   this.model.user_permissions.forEach(element => {
    //     user_permissions.push(element.id);
    //   });
    // }
    // model.user_permissions = user_permissions;

    let groups = [];
    if (this.model.groups) {
      this.model.groups.forEach(element => {
        groups.push(element.id);
      });
    }
    model.groups = groups;

    let userprofile_id = undefined;
    if (this.model.userprofile) {
      userprofile_id = this.model.userprofile.id;
    }
    let userprofile = {
      id: userprofile_id,
      avatar: this.croppedImage,
    }
    model.userprofile = userprofile;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/users']);
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
      // this.model = response.user
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.username = this.model.username;
    model.first_name = this.model.first_name;
    model.last_name = this.model.last_name;
    model.email = this.model.email;
    model.password = this.model.password;

    // let user_permissions = [];
    // if (this.model.user_permissions) {
    //   this.model.user_permissions.forEach(element => {
    //     user_permissions.push(element.id);
    //   });
    // }
    // model.user_permissions = user_permissions;

    let groups = [];
    if (this.model.groups) {
      this.model.groups.forEach(element => {
        groups.push(element.id);
      });
    }
    model.groups = groups;

    let userprofile = {
      id: undefined,
      avatar: this.croppedImage,
    }
    model.userprofile = userprofile;
    delete (model.userprofile.id);

    const sbCreate = this.modelsService.post(this.model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/users']);
        } else {
          this.formGroup.reset()
          this.croppedImage = "";
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
      // this.model = response.user as Model
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

  showModalAvatarDialog() {
    this.displayModalAvatar = true;
    this.requesting = false;
  }

  fileChangeEvent(event: any): void {
    this.requesting = true;
    this.imageChangedEvent = event;
    this.showModalAvatarDialog();
    this.newAvatar = true;
    // this.model.userprofile.avatar = this.croppedImage;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
    // console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    // console.log('Load failed');
  }

  deleteAvatar() {
    this.newAvatar = false;
  }

  cancelAvatar() {
    this.newAvatar = false;
    // this.logo.setValue('');
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

  ifModelAvatar() {
    let result = false;
    if (!this.model.userprofile) {
      result = true;
    } else {
      if (!this.model.userprofile.avatar) {
        result = true;
      }
    }
    return result;
  }

  getModelAvatar() {
    let result = undefined;
    if (this.model.userprofile) {
      if (this.model.userprofile.avatar) {
        result = this.model.userprofile.avatar
      }
    }
    return result
  }

  get passwordErrors() {
    const errors = this.password.errors;
    if (errors?.pattern) {
      const passwordValue = this.password.value;
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
