import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ClauseModel as Model } from '../../_models/clause.model';
import { ClauseService as ModelsService } from '../../_services/clause.service';
import { CompanyService } from 'src/app/pages/company/_services';
import { OfficeService } from 'src/app/pages/office/_services';

@Component({
  selector: 'app-clause-edit',
  templateUrl: './clause-edit.component.html',
  styleUrls: ['./clause-edit.component.scss']
})
export class ClauseEditComponent implements OnInit, OnDestroy {
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

  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;

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
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
    });
    this.code = this.formGroup.controls['code'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

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
        return of({ 'clause': new Model() });
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
        return of({ 'clause': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.clause;
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.code.setValue(this.model.code);
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

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/clauses']);
          } else {
            this.router.navigate(['/clauses']);
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
      this.model = response.clause
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;

    const sbCreate = this.modelsService.post(model).pipe(
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
      this.model = response.clause as Model
      if (this.saveAndExit) {
        if(this.parent){
          this.router.navigate([this.parent + '/clauses']);
        } else {
          this.router.navigate(['/clauses']);
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
}
