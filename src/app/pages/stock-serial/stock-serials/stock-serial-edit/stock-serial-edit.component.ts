import { Component, Input, Output, OnDestroy, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { StockSerialModel as Model } from '../../_models/stock-serial.model';
import { StockSerialService as ModelsService } from '../../_services/stock-serial.service';
import { StockTransactionService } from 'src/app/pages/stock-transaction/_services';

@Component({
  selector: 'app-stock-serial-edit',
  templateUrl: './stock-serial-edit.component.html',
  styleUrls: ['./stock-serial-edit.component.scss']
})
export class StockSerialEditComponent implements OnInit, OnDestroy {
  @Input() stockSerialID: { id: number, isNew: boolean};
  @Input() setView: boolean;
  @Output() displayModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public code: AbstractControl;
  public product_and_service: AbstractControl;
  public stock_transaction: AbstractControl;
  public stock: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public stockTransactionId: number;
  public parent: string;

  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private stockTransactionService: StockTransactionService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      product_and_service: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      stock_transaction: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      stock: [''],
    });
    this.code = this.formGroup.controls['code'];
    this.product_and_service = this.formGroup.controls['product_and_service'];
    this.stock_transaction = this.formGroup.controls['stock_transaction'];
    this.stock = this.formGroup.controls['stock'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    if (this.stockSerialID){
      if(this.stockSerialID.id){
        this.id = this.stockSerialID.id; 
        this.get();
      } else {
        this.id = undefined;
        this.get();
      }
    } 
    this.route.params.subscribe((params) => {
      if (this.route.snapshot.url.length > 0) {
        this.stockTransactionId = params.id;
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
        if(!this.stockSerialID){
          this.id = Number(params.get('id'));
        }
        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'stock_transaction_detail': new Model() });
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
        return of({ 'stock_transaction_detail': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.stock_transaction_detail;
        if (response.product_and_services) {
          this.model.product_and_service = response.product_and_services[0];
        }
        if (response.type_product_transactions) {
          this.model.type_product_transaction = response.type_product_transactions[0];
        }  
        if (response.stock_transactions) {
          this.model.stock_transaction = response.stock_transactions[0];
        }
        if (response.stocks) {
          this.model.stock = response.stocks[0];
        }
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model.id) {
      this.code.setValue(this.model.code);
      this.product_and_service.setValue(this.model.product_and_service);
      this.stock_transaction.setValue(this.model.stock_transaction);    
      this.stock.setValue(this.model.stock);    
    } else {
      this.code.setValue('');
      this.product_and_service.setValue('');
      if (this.stockTransactionId) {
        this.getStockTransactionById(this.stockTransactionId);
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
    model.product_and_service = this.model.product_and_service.id;
    model.type_product_transaction = this.model.type_product_transaction.id;
    model.stock_transaction = this.model.stock_transaction.id;
    model.stock = this.model.stock.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.stockSerialID) {
            this.hideModal();
          } else if(this.parent) {
            this.router.navigate([this.parent + '/stocktransactiondetails']);
          } else {
            this.router.navigate(['/stocktransactiondetails']);
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
      this.model = response.stock_transaction_detail
      if (response.product_and_services) {
        this.model.product_and_service = response.product_and_services[0];
      }
      if (response.stock_transactions) {
        this.model.stock_transaction = response.stock_transactions[0];
      }
      if (response.stocks) {
        this.model.stock = response.stocks[0];
      }
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.product_and_service = this.model.product_and_service.id;
    model.stock_transaction = this.model.stock_transaction.id;
    model.stock = this.model.stock.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.stockSerialID) {
            this.hideModal();
          } else if(this.parent) {
            this.router.navigate([this.parent + '/origindestinations']);
          } else {
            this.router.navigate(['/origindestinations']);
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
      this.model = response.stock_transaction_detail as Model
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

  getStockTransactionById(id) {
    this.stockTransactionService.getById(id).toPromise().then(
      response => {
        this.stock_transaction.setValue(response.stock_transaction);
      },
      error => {
        console.log('error getting stock_transaction');
      }
    );
  }
  hideModal(){
    this.displayModal.emit()
  }
}
