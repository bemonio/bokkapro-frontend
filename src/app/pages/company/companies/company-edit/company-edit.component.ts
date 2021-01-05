import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
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
  public loading: boolean;

  public tabs = {
    BASIC_TAB: 0,
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
  public type_company: AbstractControl;

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
    this.type_company = this.formGroup.controls['type_company'];
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
        return of({'company':new Model()});
      }),
      catchError((error) => {
        this.toastService.growl('error', error);
        return of({'company':new Model()});
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.model = response.company;
        this.previous = Object.assign({}, response.company);
        this.loadForm();  
      }
    });
    // this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model) {
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
      if (this.model.type_company) {
        this.type_company.setValue(this.model.type_company);
      }
    }
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
    model.type_company = this.model.type_company.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/companies']);
        }
      }),
      catchError((error) => {
        this.toastService.growl('error', error);
        console.error('UPDATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.company
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.loading = true;
    let model = this.model;
    model.type_company = this.model.type_company.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/companies']);
        }
      }),
      catchError((error) => {
        this.toastService.growl('error', error);
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
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
}
