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
  // denominations: any = {
  //   dolar: ['billete 1', 'billete 2', 'moneda 1', 'moneda 2'],
  //   euro: ['billete 5', 'billete 10', 'moneda 5', 'moneda 10']
  // };
  denominations: any = {
    dolar: [
      { key: 'billete1', value: 'Billete 1', valueMoney: '1' },
      { key: 'billete2', value: 'Billete 2', valueMoney: '2' },
      { key: 'moneda1', value: 'Moneda 1', valueMoney: '0.01' },
      { key: 'moneda2', value: 'Moneda 2', valueMoney: '0.02' }
    ],
    euro: [
      { key: 'billete5', value: 'Billete 5', valueMoney: '5' },
      { key: 'billete10', value: 'Billete 10', valueMoney: '10' },
      { key: 'moneda5', value: 'Moneda 5', valueMoney: '0.05' },
      { key: 'moneda10', value: 'Moneda 10', valueMoney: '0.1' }
    ]
  };
  items: SelectItem[] = [
    { label: 'Dólar', value: 'dolar' },
    { label: 'Euro', value: 'euro' }
  ];
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
    // this.badges= this.getDenominationBanknotesandCoins();
    // this.denominations = this.getDenominationBanknotesandCoins();
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
      amount: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      difference_amount: new FormControl(''),
      review: new FormControl(''),
      bank_account_number: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      currency: new FormControl('', Validators.compose([Validators.required])),
      verified: new FormControl(''),
      verified_at: new FormControl(''),
      packing: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])),
      bank_account: new FormControl(''),
      employee_who_counts: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)])),
      supervisor: new FormControl(''),
      supervisor_extra: new FormControl(''),
      selectedCurrencies: new FormControl([]),
      arrayPrincipal: new FormArray([])
    });
    // this.iterateBadge();
    this.showPage = 1;
  }

  loadForm() {
    // this.verified.setValue(false);

    if (this.model.id) {
      // this.amount.setValue(this.model.amount)
      // this.difference_amount.setValue(this.model.difference_amount)
      // this.review.setValue(this.model.review)
      // this.bank_account_number.setValue(this.model.bank_account_number)
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
      this.formGroup.patchValue({
        
        amount: this.model.amount,
        difference_amount: this.model.difference_amount,
        review: this.model.review,
        bank_account_number: this.model.bank_account_number,
        verified: this.model.verified,
        verified_at: new Date(this.model.verified_at),

        packing: this.model.packing,
        bank_account: this.model.bank_account,
        currency: this.model.currency,
        employee_who_counts: this.model.employee_who_counts,
        supervisor: this.model.supervisor,
        supervisor_extra: this.model.supervisor_extra,
      });
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

  // createFormArray(): FormArray {
  //   return new FormArray([
  //     this.createNestedFormGroup()
  //   ]);
  // }

  // createNestedFormGroup(): FormGroup {
  //   return new FormGroup({
  //     nestedFormControl1: new FormControl('', Validators.required),
  //     nestedFormControl2: new FormControl('', Validators.required)
  //   });
  // }

  // addFormArray(): void {
  //   const arrayPrincipal = this.formGroup.get('arrayPrincipal') as FormArray;
  //   arrayPrincipal.push(this.createFormArray());
  // }

  // addNestedFormGroup(formArray: FormArray): void {
  //   formArray.push(this.createNestedFormGroup());
  // }

  // deleteNestedFormGroup(formArray: FormArray, index: number): void {
  //   formArray.removeAt(index);
  // }

  // deleteFormArray(index: number): void {
  //   const arrayPrincipal = this.formGroup.get('arrayPrincipal') as FormArray;
  //   arrayPrincipal.removeAt(index);
  // }

  // //funcion que itere por cada elemento de badge y cree el form array, ademas que cree el formgroup;
  // iterateBadge(){
  //   this.badges.forEach(element => {
  //     this.addFormArrayBadge(element);
  //   });
  // }
  // addFormArrayBadge(badge=null): void {
  //   const arrayPrincipal = this.formGroup.get('arrayPrincipal') as FormArray;
  //   arrayPrincipal.push(this.createFormArrayBadge(badge));
  // }

  // createFormArrayBadge(badge): FormArray {
  //   var formBadge = new FormArray([]);
  //   badge.denominaciones.forEach(element => {
  //     formBadge.push(this.createNestedFormGroup());
  //   });
    
  //   return formBadge;
  // }
  //----
  // // onMultiSelectChange(event: any) {
  // //   const selectedValues = event.value;
  // //   console.log(selectedValues);
  // // }
  // get dynamicFormArray(): FormArray {
  //   return this.formGroup.get('arrayPrincipal') as FormArray;
  // }

  // onMultiSelectChange(event: any) {
  //   const selectedValues = event.value;

  //   // Comparar las selecciones con los elementos existentes en el FormArray
  //   const currentItems = this.dynamicFormArray.controls.map(control => control.value.item);
  //   const itemsToAdd = selectedValues.filter(value => !currentItems.includes(value));

  //   // Agregar nuevos elementos al FormArray
  //   itemsToAdd.forEach(item => {
  //     // const newGroup = this.fb.group({
  //     //   item: [item]
  //     // });
  //     // this.dynamicFormArray.push(newGroup);
  //     var elementforAdd = this.badges.find(element => item.name == element.moneda); 
  //     this.addFormArrayBadge(elementforAdd);
  //   });

  //   // Eliminar elementos del FormArray si ya no están seleccionados
  //   // for (let i = this.dynamicFormArray.controls.length - 1; i >= 0; i--) {
  //   //   const control = this.dynamicFormArray.controls[i];
  //   //   const item = control.value.item;
  //   //   if (!selectedValues.includes(item)) {
  //   //     this.dynamicFormArray.removeAt(i);
  //   //   }
  //   // }
  // }
  get dynamicFormArray(): FormArray {
    return this.formGroup.get('arrayPrincipal') as FormArray;
  }

  onMultiSelectChange(event: any) {
    const selectedValues = event.value;

    // Comparar las selecciones con los elementos existentes en el FormArray
    const currentItems = this.dynamicFormArray.controls.map(control => control.value.item);
    const itemsToAdd = selectedValues.filter(value => !currentItems.includes(value));

    // Agregar nuevos elementos al FormArray
    itemsToAdd.forEach(item => {
      const denominationsArray = this.denominations[item.value].map(denomination => this.fb.group({
        denomination: [denomination.value],
        quantity: ['0'],
        valueDenomination: [denomination.valueMoney],
        totalDimension: ['0'],
      }));
      const newGroup = this.fb.group({
        item: [item],
        denominations: this.fb.array(denominationsArray),
        subtotal: ['0'],
      });
      this.dynamicFormArray.push(newGroup);
    });

    // Eliminar elementos del FormArray si ya no están seleccionados
    for (let i = this.dynamicFormArray.controls.length - 1; i >= 0; i--) {
      const control = this.dynamicFormArray.controls[i];
      const item = control.value.item;
      if (!selectedValues.includes(item)) {
        this.dynamicFormArray.removeAt(i);
      }
    }
  }

  calcByDim(event: any, indexDenomination: string, indexControlDivisa:string){
    const quantity = event.target.value;
    

    //Encontrar formulario de divisa
    const divisaFormGroup = this.dynamicFormArray.controls[indexControlDivisa];
    
    //obtener el control del formulario correspondiente
    var controlresult = divisaFormGroup.controls.denominations.controls[indexDenomination];
    var result = quantity * controlresult.controls.valueDenomination.value;
    //asignar el resultado a dicho control
    controlresult.controls.totalDimension.setValue(result);
    this.calcByBadge(indexControlDivisa);
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
    // model.verified_at = this.formatDate(this.verified_at.value);
    model.packing = this.model.packing.id;
    model.bank_account = this.model.bank_account.id;
    model.currency = this.model.currency.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = this.model.supervisor.id;
    model.supervisor_extra = this.model.supervisor_extra.id;

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
    model.bank_account = this.model.bank_account.id;
    model.currency = this.model.currency.id;
    model.employee_who_counts = this.model.employee_who_counts.id;
    model.supervisor = this.model.supervisor.id;
    model.supervisor_extra = this.model.supervisor_extra.id;

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

  // getDenominationBanknotesandCoins(){
  //   var denominations =  [
  //     {
  //       moneda: "Dolar",
  //       denominaciones: [
  //         { valor: 1, nombre: "Billete de 1 dólar" },
  //         { valor: 5, nombre: "Billete de 5 dólares" },
  //         { valor: 10, nombre: "Billete de 10 dólares" },
  //         { valor: 20, nombre: "Billete de 20 dólares" },
  //         { valor: 50, nombre: "Billete de 50 dólares" },
  //         { valor: 100, nombre: "Billete de 100 dólares" },

  //         { valor: 0.01, nombre: "Moneda de 1 centavo" },
  //         { valor: 0.05, nombre: "Moneda de 5 centavos" },
  //         { valor: 0.10, nombre: "Moneda de 10 centavos" },
  //         { valor: 0.25, nombre: "Moneda de 25 centavos" },
  //         { valor: 0.50, nombre: "Moneda de 50 centavos" },
  //         { valor: 1, nombre: "Moneda de 1 dólar" }
  //       ],
  //     },
  //     {
  //       moneda: "Euro",
  //       denominaciones: [
  //         { valor: 5, nombre: "Billete de 5 euros" },
  //         { valor: 10, nombre: "Billete de 10 euros" },
  //         { valor: 20, nombre: "Billete de 20 euros" },
  //         { valor: 50, nombre: "Billete de 50 euros" },
  //         { valor: 100, nombre: "Billete de 100 euros" },
  //         { valor: 200, nombre: "Billete de 200 euros" },
  //         { valor: 500, nombre: "Billete de 500 euros" },
  //         { valor: 0.01, nombre: "Moneda de 1 céntimo" },
  //         { valor: 0.02, nombre: "Moneda de 2 céntimos" },
  //         { valor: 0.05, nombre: "Moneda de 5 céntimos" },
  //         { valor: 0.10, nombre: "Moneda de 10 céntimos" },
  //         { valor: 0.20, nombre: "Moneda de 20 céntimos" },
  //         { valor: 0.50, nombre: "Moneda de 50 céntimos" },
  //         { valor: 1, nombre: "Moneda de 1 euro" },
  //         { valor: 2, nombre: "Moneda de 2 euros" }
  //       ],
  //     }
  //   ];
  //   return denominations;
  // }
  getDenominationBanknotesandCoins()
  {
    var denominations = {
      dolar: [
        { key: 'Billete 1', value: '1' },
        { key: 'Billete 2', value: '2' },
        { key: 'Moneda 1', value: '0.01' },
        { key: 'Moneda 2', value: '0.02' }
      ],
      euro: [
        { key: 'Billete 5', value: '5' },
        { key: 'Billete 10', value: '10' },
        { key: 'Moneda 5', value: '0.05' },
        { key: 'Moneda 10', value: '0.1' }
      ]
    };
    return denominations;
  }
  
  getCurrencyOptions(): any {
    return [
      { name: 'Dolar', value: 'dolar' },
      { name: 'Euro', value: 'euro' }
    ];
  }
  /*
  
  - Agregar un valor al formulario con el resultado de la multiplicacion cada dimension
  - Agregar un valor que recoja el subtotal de cada moneda
  - Hacer un metodo que multiplique cada dimension
  - Hacer un metodo que sume los resultados de cada item
  - Hacer un metodo que pase a la moneda seleccionada total de moneda
  - Hacer un metodo que pase sume los subtotales 
  */
}
