import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { DepositFormModel as Model } from '../../_models/deposit-form.model';
import { DepositFormService as ModelsService } from '../../_services/deposit-form.service';
import { PackingService } from 'src/app/pages/packing/_services';
import { OfficeService } from 'src/app/pages/office/_services';
import { MultiSelectModule } from 'primeng/multiselect';
import { element } from 'protractor';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-deposit-form-edit',
  templateUrl: './deposit-form-edit.component.html',
  styleUrls: ['./deposit-form-edit.component.scss']
})
export class DepositFormEditComponent implements OnInit, OnDestroy {
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

  public packingId: number;
  public parent: string;
  
  public view: boolean;
  public showPage: number=0;
  currencies: any[];
  currencyOptions: any[];
  
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
    private packingService: PackingService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

    
    
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;
    this.currencyOptions = this.getCurrencyOptions();

    this.denominations = this.getDenominationBanknotesandCoins();
    this.items = this.getCurrencyOptions();
    this.optionsDifference = this.getOptionsDifference();
    this.createForm();

    if (this.route.parent.parent.parent.snapshot.url.length > 0) {
      this.route.parent.parent.parent.params.subscribe((params) => {
          if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
              let params1 = params.id;
              this.packingId = params1;
              this.getPackingById(params1);

              if (this.route.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                  this.route.parent.parent.parent.parent.parent.parent.params.subscribe((params) => {
                      let params2 = params.id;

                      if (this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                          this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.params.subscribe((params) => {
                              let params3 = params.id;
  
                              if (this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
                                  this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params3;
                                  this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                                  this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                              }
                          })
                      } else {
                        this.parent = '/' + this.route.parent.parent.parent.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params2;
                        this.parent = this.parent + '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
                      }
                  })
              } else {
                  this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + params1;
              }
          }
          this.get();
      });
    } else {
        this.get();
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
        return of({ 'deposit_form': new Model() });
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
        return of({ 'deposit_form': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.deposit_form;
        

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    // this.subscriptions.push(sb);
  }
  createForm() {
    this.formGroup = this.fb.group({
      amount: new FormControl('0', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(255)])),
      contain: new FormControl({value:'0', disabled: true}),
      difference: new FormControl({value:'', disabled: true}),
      difference_amount: new FormControl({value:'0', disabled: true}),
      review: new FormControl(''),
      bank: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      bank_account: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      form_number: new FormControl(',', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      currency: new FormControl('', Validators.compose([Validators.required])),
      verified: new FormControl(''),
      verified_at: new FormControl(''),
      packing: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      employee_who_counts: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)])),
      supervisor: new FormControl(''),
      supervisor_extra: new FormControl(''),
      selected_currencies: new FormControl([]),
      detail_deposit_form_edit: new FormArray([])// mainArray: new FormArray([])
    });
    this.showPage = 1;
  }

  loadForm() {
    // this.verified.setValue(false);

    if (this.model.id) {
      // this.amount.setValue(this.model.amount)
      // this.difference_amount.setValue(this.model.difference_amount)
      // this.review.setValue(this.model.review)
      // this.bank_account.setValue(this.model.bank_account)
      // this.verified.setValue(this.model.verified)
      // this.verified_at.setValue(new Date(this.model.verified_at));
      // if (this.model.packing) {
      //   this.packing.setValue(this.model.packing);
      // }
      // if (this.model.bank_account) {
      //   this.bank_account.setValue(this.model.bank_account);
      // }
      // if (this.model.currency) {
      //   this.currency.setValue(this.model.currency);
      // }
      // if (this.model.employee_who_counts) {
      //   this.employee_who_counts.setValue(this.model.employee_who_counts);
      // }
      // if (this.model.supervisor) {
      //   this.supervisor.setValue(this.model.supervisor);
      // }
      // if (this.model.supervisor_extra) {
      //   this.supervisor_extra.setValue(this.model.supervisor_extra);
      // }
      this.model.detail_deposit_form_edit = this.testMainArrayBBDD();
      this.model.selected_currencies = this.testSelectedCurrencies();

      this.formGroup.patchValue({
        
        amount: this.model.amount,        
        contain: this.model.contain,
        difference_amount: this.model.difference_amount,
        review: this.model.review,
        bank : this.model.bank,
        bank_account: this.model.bank_account,
        form_number : this.model.form_number,
        verified: this.model.verified,
        verified_at: this.model.verified_at ? new Date(this.model.verified_at) : null,
        packing: this.model.packing,
        currency: this.model.currency,
        selected_currencies: this.findMultipleElementsInJSONArray(this.currencyOptions, this.model.selected_currencies,"value"),
        employee_who_counts: this.model.employee_who_counts,
        supervisor: this.model.supervisor,
        supervisor_extra: this.model.supervisor_extra,
      });
      this.listFieldsFormsArray(this.dynamicFormArray,this.model.detail_deposit_form_edit);
      this.formGroup.get('packing').disabled;
    } else {
      if (this.packingId) {
        this.getPackingById(this.packingId);
      }
      // this.employee_who_counts.setValue(this.authService.currentUserValue.employee);
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
    return this.formGroup.get('detail_deposit_form_edit') as FormArray;
  }

  onMultiSelectChange(event: any) {
    const selectedValues = event.value;
    
    // Comparar las selecciones con los elementos existentes en el FormArray
    const currentItems = this.dynamicFormArray.controls.map(control => control.value.item);
    const itemsToAdd = selectedValues.filter(selectedValue => 
      !currentItems.some(item => item.value == selectedValue.value)
    );
    
    // Agregar nuevos elementos al FormArray
    itemsToAdd.forEach(item => {
      this.addCurrency(item);
    });

    // Eliminar elementos del FormArray si ya no están seleccionados
    for (let i = this.dynamicFormArray.controls.length - 1; i >= 0; i--) {
      const control = this.dynamicFormArray.controls[i];
      const item = control.value.item;
      if (!selectedValues.some(selectedValue => selectedValue.value == item.value)) {
        this.dynamicFormArray.removeAt(i);
      }
    }
  }

  addCurrency( nameCurrency, currency:any = null ) {
      var denominationsLoc = currency ? currency.denominations :this.denominations[nameCurrency.value];
      const denominationsArray = denominationsLoc.map(denomination => this.fb.group({
        label: [denomination.label],
        quantity: [denomination.quantity ? denomination.quantity : '0', Validators.compose([ Validators.required, Validators.minLength(1) ])],
        valueDenomination: [denomination.valueDenomination],
        totalDimension: [denomination.totalDimension ? denomination.totalDimension: '0'],
      }));
      const newGroup = this.fb.group({
        item: [currency ? currency.item : nameCurrency],
        denominations: this.fb.array(denominationsArray),
        subtotal: [currency ? currency.subtotal : '0'],
      });
      this.dynamicFormArray.push(newGroup);
    
    return;
  }

  clearFormArray = (formArray: FormArray) => 
  {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  listFieldsFormsArray(formArrayLoc: FormArray,data:any[])
  {
    this.clearFormArray(formArrayLoc);

    if(data.length>0){
      data.forEach(element => {
        this.addCurrency(element.item,element);
      });
    }
  }
  
  

  calcByDim(event: any, indexDenomination: string, indexControlDivisa:string){
    const quantity = event.target.value;
    

    //Encontrar formulario de divisa
    const divisaFormGroup = this.dynamicFormArray.controls[indexControlDivisa];
    
    //obtener el control del formulario correspondiente
    var controlDenomination = divisaFormGroup.controls.denominations.controls[indexDenomination];
    var result = quantity * controlDenomination.controls.valueDenomination.value;
    //asignar el resultado a dicho control
    controlDenomination.controls.totalDimension.setValue(result);
    this.calcContain();// this.calcByBadge(indexControlDivisa);
    this.getDifference();
  }

  calcByBadge(indexControlDivisa:string){
    //Encontrar formulario de divisa
    const divisaFormGroup = this.dynamicFormArray.controls[indexControlDivisa];
    const controlsDivisa = divisaFormGroup.controls.denominations.controls;
    
    const suma = Object.keys(controlsDivisa).reduce((acc, controlName) => {
      const controlValue = controlsDivisa[controlName].value.totalDimension;
      const valueNumber= parseFloat(controlValue);
      return acc + valueNumber;
    }, 0);
  
    divisaFormGroup.controls.subtotal.setValue(suma);
    return suma;
  }
  calcContain(){
    var total = 0;
    for(var i = 0; i < this.dynamicFormArray.controls.length; i++)
      total += this.calcByBadge(i.toString());
    
    this.formGroup.controls.contain.setValue(total);
  }
  getDifference($event=null){
    var contain = this.formGroup.controls.contain.value;
    var amount = this.formGroup.controls.amount.value;
    var difference = amount - contain;
    difference = Math.abs(difference);
    var diffValid = 0;
    this.formGroup.controls.difference_amount.setValue(difference);
    this.differenceEnable = false;
    if(difference > diffValid)
      this.differenceEnable = true;
    // poner como obligatorio o no el formControl de diferencia y el acta
    // que se active cuando se escribe el monto tambien
  }
  enableSomeControls()
  {
    this.formGroup.get('contain').enable();
    this.formGroup.get('difference').enable();
    this.formGroup.get('difference_amount').enable();
  }

  save(saveAndExit) {
    this.saveAndExit = saveAndExit;
    this.enableSomeControls();
    this.formGroup.value.selected_currencies = this.getValueCurrenciesSelected(this.formGroup.value.selected_currencies);
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
    model.verified_at = this.formatDate(this.model.verified_at);
    model.packing = (this.model.packing.id) ? this.model.packing.id : this.model.packing;
    model.bank_account = null;//model.bank_account = this.model.bank_account;//model.bank_account = this.model.bank_account.id;
    model.currency = this.model.currency.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = (this.model.supervisor) ? this.model.supervisor.id : undefined;
    model.supervisor_extra = (this.model.supervisor_extra) ?  this.model.supervisor_extra.id : undefined;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/depositforms']);
          } else {
            this.router.navigate(['/depositforms']);
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
    model.packing = this.model.packing.id;
    model.bank_account = null;//model.bank_account = this.model.bank_account;//model.bank_account = this.model.bank_account.id;
    model.currency = this.model.currency.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = (this.model.supervisor) ? this.model.supervisor.id : undefined;
    model.supervisor_extra = (this.model.supervisor_extra) ?  this.model.supervisor_extra.id : undefined;

    model.verified_at = undefined;
    // if (this.verified_at.value) {
    //   model.verified_at = this.formatDate(this.verified_at.value);
    // }

    const sbCreate = this.modelsService.post(model).pipe(
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
          this.router.navigate([this.parent + '/depositforms']);
        } else {
          this.router.navigate(['/depositforms']);
        }
      } else {
        this.clearFormArray(this.dynamicFormArray);
        this.formGroup.reset();
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

  public formatDate(date) {
    if(date == '' || date == null)
      return null;
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

    return [year, month, day].join('-');
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

  getPackingById(id) {
    this.packingService.getById(id).toPromise().then(
      response => {
        // this.packing.setValue(response.packing)
      },
      error => {
        console.log('error getting packing');
      }
    );
  }

  findMultipleElementsInJSONArray(jsonArray, selectedArray, fieldName) {
    return jsonArray.filter((jsonObject) => selectedArray.includes(jsonObject[fieldName]));
  }
  
  getValueCurrenciesSelected(currencies: any[]){
    var id_currencies = [];  
    currencies.forEach(element =>{
      id_currencies.push(element.value);
    });
    return id_currencies;
  }

  getCurrencyOptions(){
    return [
      { name: 'Dolar', value: 'dolar' },
      { name: 'Euro', value: 'euro' }
    ];
  }
  getDenominationBanknotesandCoins()
  {
    var denominations = {
      dolar: [
        { key: 'billete1', label: 'Billete 1', valueDenomination: '1' },
        { key: 'billete2', label: 'Billete 2', valueDenomination: '2' },
        { key: 'moneda1', label: 'Moneda 1', valueDenomination: '0.01' },
        { key: 'moneda2', label: 'Moneda 2', valueDenomination: '0.02' }
      ],
      euro: [
        { key: 'billete5', label: 'Billete 5', valueDenomination: '5' },
        { key: 'billete10', label: 'Billete 10', valueDenomination: '10' },
        { key: 'moneda5', label: 'Moneda 5', valueDenomination: '0.05' },
        { key: 'moneda10', label: 'Moneda 10', valueDenomination: '0.1' }
      ]
    };
    return denominations;
  }
  
  getOptionsDifference(): any {
    return [
      { key: 'Diferencia en monto, monto mayor', value: 'Diferencia en monto, monto mayor' },
      { key: 'Diferencia en monto, monto menor', value: 'Diferencia en monto, monto menor' },
      { key: 'Diferencia de cantitades de billetes', value: 'Diferencia de cantitades de billetes' },
    ];
  }

  testSelectedCurrencies(){
    return [
      "euro"
    ];
  }
  testMainArrayBBDD(){
    return [
        {
            "item": {
                "name": "Euro",
                "value": "euro"
            },
            "denominations": [
                {
                    "label": "Billete 1",
                    "quantity": "0",
                    "valueDenomination": "1",
                    "totalDimension": "0"
                },
                {
                    "label": "Billete 2",
                    "quantity": 10,
                    "valueDenomination": "2",
                    "totalDimension": 20
                },
                {
                    "label": "Moneda 1",
                    "quantity": "0",
                    "valueDenomination": "0.01",
                    "totalDimension": "0"
                },
                {
                    "label": "Moneda 2",
                    "quantity": "0",
                    "valueDenomination": "0.02",
                    "totalDimension": "0"
                }
            ],
            "subtotal": 20
        }
    ]
  }

  /*
  
 
  - Hacer un metodo que sume los resultados de cada item (ya)

  - Casilla de seleccion si hay diferencia entre valor contado y registrado  (ya)
    Diferencia en monto, monto mayor
    Diferencia en monto, monto menor
    Diferencia de cantitades de billetes

  - poner banco (ya)
  - cuenta bancaria que se digite (ya)
  - Numero de planilla, se digita (ya)
  - Acta se debe mostrar y casilla de seleccion si hay diferencia si hay diferencia (ya)

  - Que guarde es el array en las divisas (ya)
  - Que para los valores del value de las monedas traiga es el id (ya)
  
  - Que muestre la informacion  (ya, se hizo con consulta separada)
    envase, empleado 
  - En la planilla de envases, mostrar codigo de comprobante (ya)
  - Codigo de comprobante (Un comprobante contiene envases y los envases tiene planilla de deposito)
    Se debe realizar la consulta,
  - que se hace con ese bank account?
  - Falta que "suma " se divida en la moneda seleccionada y en ese caso si sume)
    Se debe realizar la consulta, con las monedas y su conversion
   
  */
}
