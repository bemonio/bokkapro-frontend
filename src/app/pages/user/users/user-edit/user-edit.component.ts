import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { UserModel as Model } from '../../_models/user.model';
import { UserService as ModelsService } from '../../_services/user.service';

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
  public user_permissions: AbstractControl;
  public groups: AbstractControl;
  public is_active: AbstractControl;
  public is_staff: AbstractControl;
  public is_superuser: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

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

    this.formGroup = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      first_name: [''],
      last_name: [''],
      email: [''],
      password: [''],
      user_permissions: [''],
      groups: [''],
      is_active: [''],
      is_staff: [''],
      is_superuser: ['']
    });
    this.username = this.formGroup.controls['username'];
    this.first_name = this.formGroup.controls['first_name'];
    this.last_name = this.formGroup.controls['last_name'];
    this.email = this.formGroup.controls['email'];
    this.password = this.formGroup.controls['password'];
    this.user_permissions = this.formGroup.controls['user_permissions'];
    this.groups = this.formGroup.controls['groups'];
    this.is_active = this.formGroup.controls['is_active'];
    this.is_staff = this.formGroup.controls['is_staff'];
    this.is_superuser = this.formGroup.controls['is_superuser'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of({ 'user': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.user;
        if (response.permissions) {
          this.model.user_permissions = response.permissions;
        }
        if (response.groups) {
          this.model.groups = response.groups;
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
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
      if (this.model.user_permissions) {
        this.user_permissions.setValue(this.model.user_permissions);
      }
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

    let user_permissions = [];
    this.model.user_permissions.forEach(element => {
      user_permissions.push(element.id);
    });
    model.user_permissions = user_permissions;

    let groups = [];
    this.model.groups.forEach(element => {
      groups.push(element.id);
    });
    model.groups = groups;

    const sbUpdate = this.modelsService.patch(this.id, this.model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.user
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

    let user_permissions = [];
    this.model.user_permissions.forEach(element => {
      user_permissions.push(element.id);
    });
    model.user_permissions = user_permissions;

    let groups = [];
    this.model.groups.forEach(element => {
      groups.push(element.id);
    });
    model.groups = groups;

    const sbCreate = this.modelsService.post(this.model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/users']);
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.user as Model
    });
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
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
