import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { ServiceOrderModel as Model } from '../../_models/service-order.model';
import { ServiceOrderService as ModelsService } from '../../_services/service-order.service';
import { CompanyService } from 'src/app/pages/company/_services';

@Component({
  selector: 'app-service-order-edit',
  templateUrl: './service-order-edit.component.html',
  styleUrls: ['./service-order-edit.component.scss']
})
export class ServiceOrderEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public total_amount: AbstractControl;
  public status: AbstractControl;
  public company: AbstractControl;
  public employee: AbstractControl;
  public contract: AbstractControl;
  public company_contact: AbstractControl;
  public office: AbstractControl;
  public product_and_service: AbstractControl;
  public note: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsStatus: { key: string, value: string }[];

  public companyId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private companyService: CompanyService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      total_amount: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],
      company: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      employee: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      contract: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      company_contact: ['', Validators.compose([Validators.required, Validators.minLength(1)])],      
      office: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      product_and_service: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      note: [''],
    });
    this.total_amount = this.formGroup.controls['total_amount'];
    this.status = this.formGroup.controls['status'];
    this.company = this.formGroup.controls['company'];
    this.employee = this.formGroup.controls['employee'];
    this.contract = this.formGroup.controls['contract'];
    this.company_contact = this.formGroup.controls['company_contact'];
    this.office = this.formGroup.controls['office'];
    this.product_and_service = this.formGroup.controls['product_and_service'];
    this.note = this.formGroup.controls['note'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.optionsStatus = [
      {key: 'Pendiente', value: 'Pendiente'},
      {key: 'Aprobado', value: 'Aprobado'},
      {key: 'No Aprobado', value: 'No Aprobado'},
      {key: 'Rechazado', value: 'Rechazado'},
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
        return of({ 'service_order': new Model() });
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
        return of({ 'service_order': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.service_order;
        if (response.companies) {
          this.model.company = response.companies[0];
        }
        if (response.employees) {
          this.model.employee = response.employees[0];
        }
        if (response.contracts) {
          this.model.contract = response.contracts[0];
        }
        if (response.company_contacts) {
          this.model.company_contact = response.company_contacts[0];
        }        
        if (response.offices) {
          this.model.office = response.offices[0];
        }
        if (response.product_and_services) {
          this.model.product_and_service = response.product_and_services[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.total_amount.setValue(this.model.total_amount);
      this.status.setValue({ key: this.model.status, value: this.model.status });
      this.note.setValue(this.model.note);
      if (this.model.company) {
        this.company.setValue(this.model.company);
      }
      if (this.model.employee) {
        this.employee.setValue(this.model.employee);
      }
      if (this.model.contract) {
        this.contract.setValue(this.model.contract);
      }
      if (this.model.company_contact) {
        this.company_contact.setValue(this.model.company_contact);
      }
      if (this.model.office) {
        this.office.setValue(this.model.office);
      }
      if (this.model.product_and_service) {
        this.product_and_service.setValue(this.model.product_and_service);
      }
    } else {
      if (this.companyId) {
        this.getCompanyById(this.companyId);
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
    model.status = this.status.value.value;
    model.company = this.model.company.id;
    model.employee = this.model.employee.id;
    model.contract = this.model.contract.id;
    model.company_contact = this.model.company_contact.id;
    model.office = this.model.office.id;
    model.product_and_service = this.model.product_and_service.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/serviceorders']);
          } else {
            this.router.navigate(['/serviceorders']);
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.service_order
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.status = this.status.value.value;
    model.company = this.model.company.id;
    model.employee = this.model.employee.id;
    model.contract = this.model.contract.id;
    model.company_contact = this.model.company_contact.id;
    model.office = this.model.office.id;
    model.product_and_service = this.model.product_and_service.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/serviceorders']);
          } else {
            this.router.navigate(['/serviceorders']);
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
      this.model = response.service_order as Model
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

  getCompanyById(id) {
    this.companyService.getById(id).toPromise().then(
      response => {
        this.company.setValue(response.company)
      },
      error => {
        console.log('error getting company');
      }
    );
  }
}
