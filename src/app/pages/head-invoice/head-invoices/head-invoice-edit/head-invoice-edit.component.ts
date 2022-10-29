import { Component, Input, Output, OnDestroy, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { HeadInvoiceModel as Model } from '../../_models/head-invoice.model';
import { HeadInvoiceService as ModelsService } from '../../_services/head-invoice.service';
import { ServiceOrderService } from 'src/app/pages/service-order/_services';

@Component({
  selector: 'app-head-invoice-edit',
  templateUrl: './head-invoice-edit.component.html',
  styleUrls: ['./head-invoice-edit.component.scss']
})
export class HeadInvoiceEditComponent implements OnInit, OnDestroy {
  @Input() headInvoiceID: { id: number, isNew: boolean};
  @Input() setView: boolean;
  @Output() displayModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public serviceorder_list: [] = [];
  public tabs = {
    BASIC_TAB: 0,
  };

  public invoice_number: AbstractControl;
  public exchange_rate: AbstractControl; 
  public tax_rate: AbstractControl; 
  public total_tax_amount: AbstractControl;
  public tax_exempt: AbstractControl;
  public total_disccount: AbstractControl;
  public from_date: AbstractControl;
  public to_date: AbstractControl;
  public due_date: AbstractControl;
  public fuel_charge: AbstractControl;
  public total_fuel_charge: AbstractControl;
  public total_amount: AbstractControl;
  public total_qty_chest: AbstractControl;
  public total_amount_chest: AbstractControl;
  public total_insurance_chest: AbstractControl;
  public total_travels: AbstractControl;
  public total_travels_directs: AbstractControl;
  public total_appraisal: AbstractControl;
  public total_cost_appraisal: AbstractControl;
  public total_handling: AbstractControl;
  public total_cost_handling: AbstractControl;
  public total_vouchers: AbstractControl;
  public total_materials: AbstractControl;
  public total_cost_materials: AbstractControl;
  public total_custody_cpv: AbstractControl;
  public total_custody_vault: AbstractControl;
  public total_custody_personal_atm: AbstractControl;
  public total_pieces: AbstractControl;
  public total_fixed_costs_packing: AbstractControl;
  public total_vigilant: AbstractControl;
  public total_atm_supply: AbstractControl;
  public total_atm_failure_1_2_levels: AbstractControl;
  public file_uploaded: AbstractControl;

  public serviceorder: AbstractControl;
  public employee: AbstractControl;
  public contract: AbstractControl;
  public company_contact: AbstractControl;
  public office: AbstractControl;
  public type_service_order: AbstractControl;
  public currency: AbstractControl;

  public files = [];
  public fileBase64: string;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public contractId: number;
  public parent: string;

  public officeUser: any;

  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private serviceOrderService: ServiceOrderService,
    public authService: AuthService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.officeUser = this.authService.currentDivisionValue.office;

    this.view = false;

    this.formGroup = this.fb.group({
      invoice_number: ['', Validators.compose([Validators.required])],
      exchange_rate: ['', Validators.compose([Validators.required])], 
      tax_rate: ['', Validators.compose([Validators.required])], 
      total_tax_amount: ['', Validators.compose([Validators.required])],
      tax_exempt: [''],
      total_disccount: ['', Validators.compose([Validators.required])],
      from_date: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      to_date: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      due_date: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      fuel_charge: ['', Validators.compose([Validators.required])],  
      total_fuel_charge: ['', Validators.compose([Validators.required])],
      total_amount: ['', Validators.compose([Validators.required])],
      total_qty_chest: ['', Validators.compose([Validators.required])],
      total_amount_chest: ['', Validators.compose([Validators.required])],
      total_insurance_chest: ['', Validators.compose([Validators.required])],
      total_travels: ['', Validators.compose([Validators.required])],
      total_travels_directs: ['', Validators.compose([Validators.required])],
      total_appraisal: ['', Validators.compose([Validators.required])],
      total_cost_appraisal: ['', Validators.compose([Validators.required])],
      total_handling: ['', Validators.compose([Validators.required])], 
      total_cost_handling: ['', Validators.compose([Validators.required])],
      total_vouchers: ['', Validators.compose([Validators.required])],
      total_materials: ['', Validators.compose([Validators.required])],
      total_cost_materials: ['', Validators.compose([Validators.required])],
      total_custody_cpv: ['', Validators.compose([Validators.required])],
      total_custody_vault: ['', Validators.compose([Validators.required])],
      total_custody_personal_atm: ['', Validators.compose([Validators.required])],
      total_pieces: ['', Validators.compose([Validators.required])],
      total_fixed_costs_packing: ['', Validators.compose([Validators.required])],
      total_vigilant: ['', Validators.compose([Validators.required])],
      total_atm_supply: ['', Validators.compose([Validators.required])],
      total_atm_failure_1_2_levels: ['', Validators.compose([Validators.required])],
      file_uploaded: [''],
      serviceorder: [''],
      employee: [''],
      contract: [''],
      company_contact: [''],
      office: [''],
      type_service_order: [''],
      currency: [''],
    });
    this.invoice_number = this.formGroup.controls['invoice_number'];
    this.exchange_rate = this.formGroup.controls['exchange_rate'];
    this.tax_rate = this.formGroup.controls['tax_rate'];
    this.total_tax_amount = this.formGroup.controls['total_tax_amount'];
    this.tax_exempt = this.formGroup.controls['tax_exempt'];
    this.total_disccount = this.formGroup.controls['total_disccount'];
    this.from_date = this.formGroup.controls['from_date'];
    this.to_date = this.formGroup.controls['to_date'];
    this.due_date = this.formGroup.controls['due_date'];
    this.fuel_charge = this.formGroup.controls['fuel_charge'];
    this.total_fuel_charge = this.formGroup.controls['total_fuel_charge'];
    this.total_amount = this.formGroup.controls['total_amount'];
    this.total_qty_chest = this.formGroup.controls['total_qty_chest'];
    this.total_amount_chest = this.formGroup.controls['total_amount_chest'];
    this.total_insurance_chest = this.formGroup.controls['total_insurance_chest'];
    this.total_travels = this.formGroup.controls['total_travels'];
    this.total_travels_directs = this.formGroup.controls['total_travels_directs'];
    this.total_appraisal = this.formGroup.controls['total_appraisal'];
    this.total_cost_appraisal = this.formGroup.controls['total_cost_appraisal'];
    this.total_handling = this.formGroup.controls['total_handling'];
    this.total_cost_handling = this.formGroup.controls['total_cost_handling'];
    this.total_vouchers = this.formGroup.controls['total_vouchers'];
    this.total_materials = this.formGroup.controls['total_materials'];
    this.total_cost_materials = this.formGroup.controls['total_cost_materials'];
    this.total_custody_cpv = this.formGroup.controls['total_custody_cpv'];
    this.total_custody_vault = this.formGroup.controls['total_custody_vault'];
    this.total_custody_personal_atm = this.formGroup.controls['total_custody_personal_atm'];
    this.total_pieces = this.formGroup.controls['total_pieces'];
    this.total_fixed_costs_packing = this.formGroup.controls['total_fixed_costs_packing'];
    this.total_vigilant = this.formGroup.controls['total_vigilant'];
    this.total_atm_supply = this.formGroup.controls['total_atm_supply'];
    this.total_atm_failure_1_2_levels = this.formGroup.controls['total_atm_failure_1_2_levels'];
    this.file_uploaded = this.formGroup.controls['file_uploaded'];

    this.serviceorder= this.formGroup.controls['serviceorder'];
    this.employee= this.formGroup.controls['employee'];
    this.contract= this.formGroup.controls['contract'];
    this.company_contact= this.formGroup.controls['company_contact'];
    this.office= this.formGroup.controls['office'];
    this.type_service_order= this.formGroup.controls['type_service_order'];
    this.currency= this.formGroup.controls['currency'];

    this.files = [];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    if (this.headInvoiceID){
      if(this.headInvoiceID.id){
        this.id = this.headInvoiceID.id; 
        this.get();
      } else {
        this.id = undefined;
        this.get();
      }
    } 
    this.route.params.subscribe((params) => {
      if (this.route.snapshot.url.length > 0) {
        this.contractId = params.id;
      }
      this.get();
    });

    if (this.route.snapshot.url[0].path == 'view'  || this.setView) {
      Object.keys(this.formGroup.controls).forEach(control => {
        this.formGroup.controls[control].disable();
      });
      this.view = true;
    }
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  get() {
    this.requesting = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        if(!this.headInvoiceID){
          this.id = Number(params.get('id'));
        }
        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'head_invoice': new Model() });
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
        return of({ 'head_invoice': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.head_invoice;
        if (response.contracts)
          this.model.contract = response.contracts[0];
        if (response.employees)
          this.model.employee = response.employees[0];
        if (response.company_contacts)
          this.model.company_contact = response.company_contacts[0];
        if (response.offices)
          this.model.office = response.offices[0];
        if (response.type_service_orders)
          this.model.type_service_order = response.type_service_orders[0];
        if (response.currencys)
          this.model.currency = response.currencys[0];

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.invoice_number.setValue(this.model.invoice_number);
      this.exchange_rate.setValue(this.model.exchange_rate);
      this.tax_rate.setValue(this.model.tax_rate);
      this.total_tax_amount.setValue(this.model.total_tax_amount);
      this.tax_exempt.setValue(this.model.tax_exempt);
      this.total_disccount.setValue(this.model.total_disccount);
      this.model.from_date != undefined ? this.from_date.setValue(new Date(this.formatDate(this.model.from_date))) : undefined;
      this.model.to_date != undefined ? this.to_date.setValue(new Date(this.formatDate(this.model.to_date))) : undefined;
      this.model.due_date != undefined ? this.due_date.setValue(new Date(this.formatDate(this.model.due_date))) : undefined;
      this.fuel_charge.setValue(this.model.fuel_charge);
      this.total_fuel_charge.setValue(this.model.total_fuel_charge);
      this.total_amount.setValue(this.model.total_amount);
      this.total_qty_chest.setValue(this.model.total_qty_chest);
      this.total_amount_chest.setValue(this.model.total_amount_chest);
      this.total_insurance_chest.setValue(this.model.total_insurance_chest);
      this.total_travels.setValue(this.model.total_travels);
      this.total_travels_directs.setValue(this.model.total_travels_directs);
      this.total_appraisal.setValue(this.model.total_appraisal);
      this.total_cost_appraisal.setValue(this.model.total_cost_appraisal);
      this.total_handling.setValue(this.model.total_handling);
      this.total_cost_handling.setValue(this.model.total_cost_handling);
      this.total_vouchers.setValue(this.model.total_vouchers);
      this.total_materials.setValue(this.model.total_materials);
      this.total_cost_materials.setValue(this.model.total_cost_materials);
      this.total_custody_cpv.setValue(this.model.total_custody_cpv);
      this.total_custody_vault.setValue(this.model.total_custody_vault);
      this.total_custody_personal_atm.setValue(this.model.total_custody_personal_atm);
      this.total_pieces.setValue(this.model.total_pieces);
      this.total_fixed_costs_packing.setValue(this.model.total_fixed_costs_packing);
      this.total_vigilant.setValue(this.model.total_vigilant);
      this.total_atm_supply.setValue(this.model.total_atm_supply);
      this.total_atm_failure_1_2_levels.setValue(this.model.total_atm_failure_1_2_levels);
  
      this.files = [];
      if (this.model.file_uploaded) {
        this.files.push({name:this.model.id, file_uploaded:this.model.file_uploaded})
      }

      if (this.model.contract) {
        this.contract.setValue(this.model.contract);
      }

      if (this.model.employee) {
        this.employee.setValue(this.model.employee);
      }
      
      if (this.model.company_contact) {
        this.company_contact.setValue(this.model.company_contact);
      }

      if (this.model.office) {
        this.office.setValue(this.model.office);
      }

      if (this.model.type_service_order) {
        this.type_service_order.setValue(this.model.type_service_order);
      }   
      
      if (this.model.currency) {
        this.currency.setValue(this.model.currency);
      }   

    } else {
      this.invoice_number.setValue('');
      this.exchange_rate.setValue('');
      this.tax_rate.setValue('');
      this.total_tax_amount.setValue('');
      this.tax_exempt.setValue('');
      this.total_disccount.setValue('');
      this.from_date.setValue('');
      this.to_date.setValue('');
      this.due_date.setValue('');
      this.fuel_charge.setValue('');
      this.total_fuel_charge.setValue('');
      this.total_amount.setValue('');
      this.total_qty_chest.setValue('');
      this.total_amount_chest.setValue('');
      this.total_insurance_chest.setValue('');
      this.total_travels.setValue('');
      this.total_travels_directs.setValue('');
      this.total_appraisal.setValue('');
      this.total_cost_appraisal.setValue('');
      this.total_handling.setValue('');
      this.total_cost_handling.setValue('');
      this.total_vouchers.setValue('');
      this.total_materials.setValue('');
      this.total_cost_materials.setValue('');
      this.total_custody_cpv.setValue('');
      this.total_custody_vault.setValue('');
      this.total_custody_personal_atm.setValue('');
      this.total_pieces.setValue('');
      this.total_fixed_costs_packing.setValue('');
      this.total_vigilant.setValue('');
      this.total_atm_supply.setValue('');
      this.total_atm_failure_1_2_levels.setValue('');
  
      this.serviceorder.setValue('');
      this.employee.setValue('');
      this.contract.setValue('');
      this.company_contact.setValue('');
      this.office.setValue('');
      this.type_service_order.setValue('');
      this.currency.setValue('');
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
    model.serviceorder = this.model.serviceorder.id;
    model.employee = this.model.employee.id;
    model.contract = this.model.contract.id;
    model.company_contact = this.model.company_contact.id;
    model.office = this.model.office.id;
    model.type_service_order = this.model.type_service_order.id;
    model.currency = this.model.currency.id;
    model.file_uploaded = this.fileBase64;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.headInvoiceID) {
            this.hideModal();
          } else if(this.parent) {
            this.router.navigate([this.parent + '/headinvoices']);
          } else {
            this.router.navigate(['/headinvoices']);
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
      // this.model = response.head_invoice
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.serviceorder = this.model.serviceorder.id;
    model.employee = this.model.employee.id;
    model.contract = this.model.contract.id;
    model.company_contact = this.model.company_contact.id;
    model.office = this.model.office.id;
    model.type_service_order = this.model.type_service_order.id;
    model.currency = this.model.currency.id;
    model.file_uploaded = this.fileBase64;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.headInvoiceID) {
            this.hideModal();
          } else if(this.parent) {
            this.router.navigate([this.parent + '/headinvoices']);
          } else {
            this.router.navigate(['/headinvoices']);
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
      this.model = response.head_invoice as Model
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

  hideModal(){
    this.displayModal.emit()
  }

  public changeContract (contract) {
    this.getServiceOrderByContractId(contract.id)
  }

  getServiceOrderByContractId(id) {
    let page = 1;
    let per_page = 10; 
    let sort = '-id';
    let query = '';
    let filters = [];
    let _with = undefined;

    filters.push({ key: 'filter{contract}', value: id })

    this.serviceOrderService.get(page, per_page, sort, query, filters, _with).toPromise().then(
      response => {
        if (response.service_orders.length >= 1) {
          this.serviceorder_list = response.service_orders;
          this.serviceorder.setValue(response.service_orders[0]);
        }
      },
      error => {
        console.log('error getting serviceOrder');
      }
    );
  }  

  public onSelect(event) {
    this.files = []
    for(let file of event.files) {
      this.files.push(file);
    }
    this.convertFile(event.files[0]).subscribe(base64 => {
      this.fileBase64 = 'data:' + this.files[0].type + ';base64,' + base64;
    });    
  }

  public showFile(url) {
    window.open(url, '_blank');
  }    

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

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

    return [year, month, day].join('-') + ' ' + [hours, minutes].join(':');
  }
}