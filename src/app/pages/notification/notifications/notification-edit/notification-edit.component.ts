import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { NotificationModel as Model } from '../../_models/notification.model';
import { NotificationService as ModelsService } from '../../_services/notification.service';
import { CompanyService } from 'src/app/pages/company/_services';
import { OfficeService } from 'src/app/pages/office/_services';

@Component({
  selector: 'app-notification-edit',
  templateUrl: './notification-edit.component.html',
  styleUrls: ['./notification-edit.component.scss']
})
export class NotificationEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    OFFICE_TAB: 1,
  };

  public icon: AbstractControl;
  public title: AbstractControl;
  public description: AbstractControl;
  public link: AbstractControl;
  public is_read: AbstractControl;
  public type: AbstractControl;
  public module: AbstractControl;

  public employee_origin: AbstractControl;
  public employee_destination: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsType: { key: string, value: string }[];

  public companyId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private companyService: CompanyService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      icon: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      title: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      link: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      is_read: [''],
      type: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      module: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      employee_origin: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      employee_destination: ['', Validators.compose([Validators.required])],
    });
    this.icon = this.formGroup.controls['icon'];
    this.title = this.formGroup.controls['title'];
    this.description = this.formGroup.controls['description'];
    this.link = this.formGroup.controls['link'];
    this.is_read = this.formGroup.controls['is_read'];
    this.type = this.formGroup.controls['type'];
    this.module = this.formGroup.controls['module'];
    this.employee_origin = this.formGroup.controls['employee_origin'];
    this.employee_destination = this.formGroup.controls['employee_destination'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.optionsType = [
      {key: 'Alerta', value: 'Alerta'},
      {key: 'Notificación', value: 'Notificación'},
    ];

    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.companyId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.companyId;
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
        return of({ 'notification': new Model() });
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
        return of({ 'notification': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.notification;
        if (response.employees) {
          this.model.employee_origin = response.employees[0];
        }
        if (response.employees) {
          this.model.employee_destination = response.employees[1];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.icon.setValue(this.model.icon);
      this.title.setValue(this.model.title);
      this.description.setValue(this.model.description);
      this.link.setValue(this.model.link);
      this.is_read.setValue(this.model.is_read);
      this.type.setValue({ key: this.model.type, value: this.model.type });
      this.module.setValue(this.model.module);
      if (this.model.employee_origin) {
        this.employee_origin.setValue(this.model.employee_origin);
      }
      if (this.model.employee_destination) {
        this.employee_destination.setValue(this.model.employee_destination);
      }
    } else {
      this.is_read.setValue(false);
      // if (this.companyId) {
      //   this.getCompanyById(this.companyId);
      // }
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
    model.type = this.type.value.value;
    model.employee_origin = this.model.employee_origin.id;
    model.employee_destination = this.model.employee_destination.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/notifications']);
          } else {
            this.router.navigate(['/notifications']);
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
      this.model = response.notification
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    
    let model = this.model;
    model.type = this.type.value.value;
    model.employee_origin = this.model.employee_origin.id;
    model.employee_destination = this.model.employee_destination.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/notifications']);
          } else {
            this.router.navigate(['/notifications']);
          }
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
      this.model = response.crew as Model
    });
    this.subscriptions.push(sbCreate);
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

  // getCompanyById(id) {
  //   this.companyService.getById(id).toPromise().then(
  //     response => {
  //       this.company.setValue(response.company)
  //     },
  //     error => {
  //       console.log('error getting company');
  //     }
  //   );
  // }

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

    return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
  }
}
