import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ContentTypeModel as Model } from '../../_models/content-type.model';
import { ContentTypeService as ModelsService } from '../../_services/content-type.service';
import { CompanyService } from 'src/app/pages/company/_services';

@Component({
  selector: 'app-content-type-edit',
  templateUrl: './content-type-edit.component.html',
  styleUrls: ['./content-type-edit.component.scss']
})
export class ContentTypeEditComponent implements OnInit, OnDestroy {
  public id: number;
  public thismodel: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public app_label: AbstractControl;
  public model: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsStatus: { key: string, value: string }[];

  public companyId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private thismodelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private companyService: CompanyService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      app_label: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],

    });
    this.app_label = this.formGroup.controls['app_label'];
    this.model = this.formGroup.controls['model'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.thismodel = undefined;
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
          return this.thismodelsService.getById(this.id);
        }
        return of({ 'content_type': new Model() });
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
        return of({ 'content_type': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.thismodel = response.content_type;
        this.previous = Object.assign({}, this.thismodel);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.thismodel.id) {
      this.app_label.setValue(this.thismodel.app_label);
      this.model.setValue(this.thismodel.model);
    } 
    this.formGroup.markAllAsTouched();
  }

  reset() {
    if (this.previous) {
      this.thismodel = Object.assign({}, this.previous);
      this.loadForm();
    }
  }

  save(saveAndExit) {
    this.saveAndExit = saveAndExit;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      this.thismodel = Object.assign(this.thismodel, formValues);
      if (this.id) {
        this.edit();
      } else {
        this.create();
      }
    }
  }

  edit() {
    this.requesting = true;
    let thismodel = this.thismodel;

    const sbUpdate = this.thismodelsService.patch(this.id, thismodel).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/contenttypes']);
          } else {
            this.router.navigate(['/contenttypes']);
          }
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
        return of(this.thismodel);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.thismodel = response.content_type
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let thismodel = this.thismodel;

    const sbCreate = this.thismodelsService.post(thismodel).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/contenttypes']);
          } else {
            this.router.navigate(['/contenttypes']);
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of(this.thismodel);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.thismodel = response.content_type as Model
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

  public getValidClass(valid) {
    let stringClass = 'form-control form-control-lg form-control-solid';
    if (valid) {
      stringClass += ' is-valid';
    } else {
      stringClass += ' is-invalid';
    }
    return stringClass;
  }
}
