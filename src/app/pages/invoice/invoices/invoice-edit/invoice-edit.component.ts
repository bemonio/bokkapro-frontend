import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { InvoiceModel as Model } from '../../_models/invoice.model';
import { InvoiceService as ModelsService } from '../../_services/invoice.service';
import { PackingService } from 'src/app/pages/packing/_services';
import { OfficeService } from 'src/app/pages/office/_services';
import { CompanyService } from 'src/app/pages/company/_services';
import { ContractService } from 'src/app/pages/contract/_services';
import { MultiSelectModule } from 'primeng/multiselect';
import { element } from 'protractor';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public badges: any[];

  public tabs = {
    BASIC_TAB: 0,
    DEPOSITFORMDETAIL_TAB: 1,
  };
  
  public activeTabId: number;
  // private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsExpiresIn: { key: string, value: string }[];

  public contractId: number;

  public company_name: AbstractControl;
  // public company_code: AbstractControl;
  // public company_identification: AbstractControl;
  public contract: AbstractControl;
  public expires_in: AbstractControl;
  public date: AbstractControl; 
  public quantity: AbstractControl;
  public amount: AbstractControl;
  public currency: AbstractControl;
  public invoice_description: AbstractControl;
  public number: AbstractControl;
  public parent: string;
  public subtotal: AbstractControl;
  public total: AbstractControl;
  public item_description: AbstractControl;
  
  public view: boolean;
  currencies: any[];
  currencyOptions: any[];
  arrayControls: string[];
  
  public denominations: any;
  public items: SelectItem[];

  public optionsDifference: { key: string, value: string }[];
  public differenceEnable: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastService: ToastService,
    private companyService: CompanyService,
    private contractService: ContractService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

    this.formGroup = this.fb.group({
      contract: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      number: new FormControl('0', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      company_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      expires_in: new FormControl('', Validators.compose([Validators.required])),
      date: new FormControl('', Validators.compose([Validators.required])),
      subtotal: new FormControl(0),
      total: new FormControl(0),
      invoice_items: new FormArray([])
    });
    this.contract = this.formGroup.controls['contract'];
    this.expires_in = this.formGroup.controls['expires_in'];
    this.date = this.formGroup.controls['date'];
    this.number = this.formGroup.controls['number'];
    this.company_name = this.formGroup.controls['company_name'];
    this.subtotal = this.formGroup.controls['subtotal'];
    this.total = this.formGroup.controls['total'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.optionsExpiresIn = [
      {key: '15', value: '15'},
      {key: '30', value: '30'},
    ];

    this.get();

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
        return of({ 'invoice': new Model() });
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
        return of({ 'invoice': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.invoice;
        if (response.contracts) {
          this.model.contract = response.contracts[0];
        }
        if (response.companies) {
          this.model.contract.company = response.companies[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }
  
  loadForm() {
    if (this.model && this.model.id) {
      this.number.setValue(this.model.number)
      this.expires_in.setValue({ key: this.model.expires_in, value: this.model.expires_in });
      this.date.setValue(new Date(this.model.date));
      if (this.model.contract) {
        this.contract.setValue(this.model.contract);
        if (this.model.contract.company) {
          this.company_name.setValue(this.model.contract.company.name);
        }
      }
      if (this.model.invoice_items) {
        this.model.invoice_items.forEach(element => {
          const newItem = this.createItem(); // Crea un nuevo FormGroup

          // Asigna los valores a los controles del nuevo FormGroup
          newItem.get('item_description').setValue(element.description);
          newItem.get('quantity').setValue(element.quantity);
          newItem.get('amount').setValue(element.unit_price);
      
          this.dynamicFormArray.push(newItem);
        });
        this.calcTotal()
      }
    } else {
      this.number.setValue('');
      this.expires_in.setValue('');
      this.date.setValue(new Date());
    }
    this.formGroup.markAllAsTouched();
  }

  reset() {
    if (this.previous) {
      this.model = Object.assign({}, this.previous);
      this.loadForm();
    }
  }

  get dynamicFormArray(): FormArray {
    return this.formGroup.get('invoice_items') as FormArray;
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
    let due_date = new Date(model.date)
    due_date.setDate(due_date.getDate() + parseInt(this.model.expires_in, 0));
    model.due_date = this.formatDate(due_date);
    model.date = this.formatDate(model.date);

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/invoices']);
          } else {
            this.router.navigate(['/invoices']);
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
          ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.deposit_form
    });
    // this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.expires_in = this.expires_in.value.value;
    let due_date = new Date(model.date)
    due_date.setDate(due_date.getDate() + parseInt(this.model.expires_in, 0));
    model.due_date = this.formatDate(due_date);
    model.date = this.formatDate(model.date);
    model.discount = 0;
    model.discount_amount = 0;
    model.tax_rate = 0;
    model.tax_amount = 0;
    delete model.contract;
    const sbCreate = this.modelsService.postInvoiceItems(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
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
            ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
          );
        } else {
          this.toastService.growl('top-right', 'error', error.error)
        }
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.deposit_form as Model
      if (this.saveAndExit) {
        if(this.parent){
          this.router.navigate([this.parent + '/invoices']);
        } else {
          this.router.navigate(['/invoices']);
        }
      } else {
        this.formGroup.reset()
      }
    });
    // this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    this.ngOnInit();
  }
  ngOnDestroy() {
    // this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  arrayIsControlValid(controlName: string, position: number): boolean {
    const control = this.dynamicFormArray.controls[position].get(controlName);
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  arrayIsControlInvalid(controlName: string, position: number): boolean {
    const control = this.dynamicFormArray.controls[position].get(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  arrayControlHasError(validation: string, controlName: string, position: number) {
    const control = this.dynamicFormArray.controls[position].get(controlName);
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  arrayIsControlTouched(controlName: string, position: number): boolean {
    const control = this.dynamicFormArray.controls[position].get(controlName);
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
  //   console.log('entramos');
  //   this.companyService.getById(id).toPromise().then(
  //     response => {
  //       this.model.company_name = response.company;
  //     },
  //    error => {
  //     console.log('error getting company');
  //      }
  //   );
  // }
  getValues(value) {
    this.formGroup.patchValue({        
      company_name: value.name_invoce_to,
    });
    this.model.contract_id = value.id;
    this.model.company_id = value.company;
  }
  getContractById(id) {
    this.contractService.getById(id).toPromise().then(
      response => {
        this.company_name.setValue(response.company);
        //console.log('company', this.company_name);
      },
      error => {
        console.log('error getting company');
      }
    );
  }

  addItem(event: any) { 
    event.preventDefault();
    this.dynamicFormArray.push(this.createItem());
    //refresh Form group
    this.formGroup.setControl('invoice_items', this.dynamicFormArray);
    //update FormGroup
    this.dynamicFormArray.updateValueAndValidity();
    console.log(this.formGroup);
    console.log(this.dynamicFormArray);


  }

  deleteItem(event: any) { 
    //eliminar la ultima posicion del arreglo de items
    event.preventDefault();
    this.dynamicFormArray.removeAt(this.dynamicFormArray.length-1);
    //refresh Form group
    this.formGroup.setControl('invoice_items', this.dynamicFormArray);
    //update FormGroup
    this.dynamicFormArray.updateValueAndValidity();

  }

  createItem(){
    // this.item_description = this.dynamicFormArray.controls['invoice_description'];
    // this.quantity = this.dynamicFormArray.controls['quantity'];
    // this.amount = this.dynamicFormArray.controls['amount'];
    return this.fb.group({
      item_description: new FormControl('', Validators.compose([Validators.required])),
      quantity: new FormControl('', Validators.compose([Validators.required])),
      amount: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  calcTotal(){
    let total = 0;
    this.dynamicFormArray.controls.forEach(element => {
      total += element.value.quantity * element.value.amount;
    });
    this.model.total = total;
    this.model.subtotal = total;
    this.formGroup.patchValue({        
      subtotal: total,
      total: total,
    });
    console.log(this.formGroup);
    //actualizar formGroup
    this.formGroup.updateValueAndValidity();
    
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

    return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
  }

  /*
  
 
  - Hacer un metodo que sume los resultados de cada item (ya)

  - Casilla de seleccion si hay diferencia entre valor contado y registrado  (ya)
    Diferencia en monto, monto mayor
    Diferencia en monto, monto menor
    Diferencia de cantitades de billetes

  - poner banco (ya)
  - cuenta bancaria que se digite (ya)

  - Falta que "suma " se divida en la moneda seleccionada y en ese caso si sume)
    Se debe realizar la consulta, con las monedas y su conversion
  - Numero de planilla, se digita 
  - Acta se debe mostrar y casilla de seleccion si hay diferencia si hay diferencia
  - Codigo de comprobante (Unc comprobante contiene envases y los envases tiene planilla de deposito)
    Se debe realizar la consulta,
  - En la planilla de envases, mostrar codigo de comprobante
  - Que actualice los valores traidos desde el backend
  */
}
