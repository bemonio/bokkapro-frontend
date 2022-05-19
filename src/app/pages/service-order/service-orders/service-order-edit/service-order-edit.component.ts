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
  public total_fixed_costs: AbstractControl;
  public travels: AbstractControl;
  public travels_directs: AbstractControl;
  public appraisal: AbstractControl;
  public handling: AbstractControl;
  public materials: AbstractControl;
  public custody_cpv: AbstractControl;
  public custody_vault: AbstractControl;
  public custody_personal_atm:AbstractControl;
  public pieces: AbstractControl;
  public fixed_costs_packing:AbstractControl;
  public vigilant:AbstractControl;
  public atm_supply:AbstractControl;
  public atm_failure_1_2_levels:AbstractControl;
  public excess_travels:AbstractControl;
  public excess_travels_directs:AbstractControl;
  public excess_appraisal:AbstractControl;
  public excess_handling:AbstractControl;
  public excess_materials:AbstractControl;
  public excess_vigilant_extra_hours:AbstractControl;
  public excess_custody_cpv:AbstractControl;
  public excess_custody_vault:AbstractControl;
  public excess_custody_personal_atm:AbstractControl;
  public excess_pieces:AbstractControl;
  public is_active: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsStatus: { key: string, value: string }[];

  public companyId: number;
  public parent: string;
  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private companyService: CompanyService,
    public authService: AuthService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

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

      total_fixed_costs: [''],
      travels: [''],
      travels_directs: [''],
      appraisal: [''],
      handling: [''],
      materials: [''],
      custody_cpv: [''],
      custody_vault: [''],
      custody_personal_atm: [''],
      pieces: [''],
      fixed_costs_packing: [''],
      vigilant: [''],
      atm_supply: [''],
      atm_failure_1_2_levels: [''],
      excess_travels: [''],
      excess_travels_directs: [''],
      excess_appraisal: [''],
      excess_handling: [''],
      excess_materials: [''],
      excess_vigilant_extra_hours: [''],
      excess_custody_cpv: [''],
      excess_custody_vault: [''],
      excess_custody_personal_atm: [''],
      excess_pieces: [''],
      is_active: [''],
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
    this.total_fixed_costs = this.formGroup.controls['total_fixed_costs'];
    this.travels = this.formGroup.controls['travels'];
    this.travels_directs = this.formGroup.controls['travels_directs'];
    this.appraisal = this.formGroup.controls['appraisal'];
    this.handling = this.formGroup.controls['handling'];
    this.materials = this.formGroup.controls['materials'];
    this.custody_cpv = this.formGroup.controls['custody_cpv'];
    this.custody_vault = this.formGroup.controls['custody_vault'];
    this.custody_personal_atm = this.formGroup.controls['custody_personal_atm'];
    this.pieces = this.formGroup.controls['pieces'];
    this.fixed_costs_packing = this.formGroup.controls['fixed_costs_packing'];
    this.vigilant = this.formGroup.controls['vigilant'];
    this.atm_supply = this.formGroup.controls['atm_supply'];
    this.atm_failure_1_2_levels = this.formGroup.controls['atm_failure_1_2_levels'];
    this.excess_travels = this.formGroup.controls['excess_travels'];
    this.excess_travels_directs = this.formGroup.controls['excess_travels_directs'];
    this.excess_appraisal = this.formGroup.controls['excess_appraisal'];
    this.excess_handling = this.formGroup.controls['excess_handling'];
    this.excess_materials = this.formGroup.controls['excess_materials'];
    this.excess_vigilant_extra_hours = this.formGroup.controls['excess_vigilant_extra_hours'];
    this.excess_custody_cpv = this.formGroup.controls['excess_custody_cpv'];
    this.excess_custody_vault = this.formGroup.controls['excess_custody_vault'];
    this.excess_custody_personal_atm = this.formGroup.controls['excess_custody_personal_atm'];
    this.excess_pieces = this.formGroup.controls['excess_pieces'];
    this.is_active = this.formGroup.controls['is_active'];
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
        if (this.route.parent.parent.parent.snapshot.url[0].path === 'edit') {
          this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.companyId;
        } else {
          Object.keys(this.formGroup.controls).forEach(control => {
            this.formGroup.controls[control].disable();
          });
          this.view = true;
          this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/view/' + this.companyId;
        }
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
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
      this.total_fixed_costs.setValue(this.model.total_fixed_costs);
      this.travels.setValue(this.model.travels);
      this.travels_directs.setValue(this.model.travels_directs);
      this.appraisal.setValue(this.model.appraisal);
      this.handling.setValue(this.model.handling);
      this.materials.setValue(this.model.materials);
      this.custody_cpv.setValue(this.model.custody_cpv);
      this.custody_vault.setValue(this.model.custody_vault);
      this.custody_personal_atm.setValue(this.model.custody_personal_atm);
      this.pieces.setValue(this.model.pieces);
      this.fixed_costs_packing.setValue(this.model.fixed_costs_packing);
      this.vigilant.setValue(this.model.vigilant);
      this.atm_supply.setValue(this.model.atm_supply);
      this.atm_failure_1_2_levels.setValue(this.model.atm_failure_1_2_levels);
      this.excess_travels.setValue(this.model.excess_travels);
      this.excess_travels_directs.setValue(this.model.excess_travels_directs);
      this.excess_appraisal.setValue(this.model.excess_appraisal);
      this.excess_handling.setValue(this.model.excess_handling);
      this.excess_materials.setValue(this.model.excess_materials);
      this.excess_vigilant_extra_hours.setValue(this.model.excess_vigilant_extra_hours);
      this.excess_custody_cpv.setValue(this.model.excess_custody_cpv);
      this.excess_custody_vault.setValue(this.model.excess_custody_vault);
      this.excess_custody_personal_atm.setValue(this.model.excess_custody_personal_atm);
      this.excess_pieces.setValue(this.model.excess_pieces);
      this.is_active.setValue(this.model.is_active);
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
      this.total_amount.setValue(0);
      this.total_fixed_costs.setValue(0);
      this.travels.setValue(0);
      this.travels_directs.setValue(0);
      this.appraisal.setValue(0);
      this.handling.setValue(0);
      this.materials.setValue(0);
      this.custody_cpv.setValue(0);
      this.custody_vault.setValue(0);
      this.custody_personal_atm.setValue(0);
      this.pieces.setValue(0);
      this.fixed_costs_packing.setValue(0);
      this.vigilant.setValue(0);
      this.atm_supply.setValue(0);
      this.atm_failure_1_2_levels.setValue(0);
      this.excess_travels.setValue(0);
      this.excess_travels_directs.setValue(0);
      this.excess_appraisal.setValue(0);
      this.excess_handling.setValue(0);
      this.excess_materials.setValue(0);
      this.excess_vigilant_extra_hours.setValue(0);
      this.excess_custody_cpv.setValue(0);
      this.excess_custody_vault.setValue(0);
      this.excess_custody_personal_atm.setValue(0);
      this.excess_pieces.setValue(0);
      this.is_active.setValue(false);

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
        this.toastService.growl('top-right', 'success', 'success');
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
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
        this.toastService.growl('top-right', 'success', 'success');
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
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
