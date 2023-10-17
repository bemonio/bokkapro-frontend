import { Component, Input, Output, OnDestroy, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { InvoiceItemModel as Model } from '../../_models/invoice-item.model';
import { InvoiceItemService as ModelsService } from '../../_services/invoice-item.service';
import { HeadInvoiceService } from 'src/app/pages/head-invoice/_services';

@Component({
  selector: 'app-invoice-item-edit',
  templateUrl: './invoice-item-edit.component.html',
  styleUrls: ['./invoice-item-edit.component.scss']
})
export class InvoiceItemEditComponent implements OnInit, OnDestroy {
  @Input() detailInvoiceID: { id: number, isNew: boolean};
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

  public details: AbstractControl;
  public details2: AbstractControl;
  public signo: AbstractControl;
  public vaultinc: AbstractControl;
  public quantity: AbstractControl;
  public quantity2: AbstractControl;
  public total_amount: AbstractControl;
  public tax_exempt: AbstractControl;
  public disccount: AbstractControl;
  public head_invoice: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public headInvoiceId: number;
  public parent: string;

  public view: boolean;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private headInvoiceService: HeadInvoiceService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.view = false;

    this.formGroup = this.fb.group({      
      details: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      details2: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      signo: [''],
      vaultinc: [''],
      quantity: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      quantity2 : ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      total_amount: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      tax_exempt: [''],
      disccount: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      head_invoice: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.details = this.formGroup.controls['details'];
    this.details2 = this.formGroup.controls['details2'];
    this.signo = this.formGroup.controls['signo'];
    this.vaultinc = this.formGroup.controls['vaultinc'];
    this.quantity = this.formGroup.controls['quantity'];
    this.quantity2 = this.formGroup.controls['quantity2'];
    this.total_amount = this.formGroup.controls['total_amount'];
    this.tax_exempt = this.formGroup.controls['tax_exempt'];
    this.disccount = this.formGroup.controls['disccount'];
    
    this.head_invoice = this.formGroup.controls['head_invoice'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    if (this.detailInvoiceID){
      if(this.detailInvoiceID.id){
        this.id = this.detailInvoiceID.id; 
        this.get();
      } else {
        this.id = undefined;
        this.get();
      }
    } 
    this.route.params.subscribe((params) => {
      if (this.route.snapshot.url.length > 0) {
        this.headInvoiceId = params.id;
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
        if(!this.detailInvoiceID){
          this.id = Number(params.get('id'));
        }
        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'detail_invoice': new Model() });
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
        return of({ 'detail_invoice': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.detail_invoice;
        if (response.head_invoices)
          this.model.head_invoice = response.head_invoices[0];
        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.signo.setValue(false);
    this.vaultinc.setValue(false);
    this.tax_exempt.setValue(false);
    if (this.model && this.model.id) {
      this.details.setValue(this.model.details);
      this.details2.setValue(this.model.details2);
      this.vaultinc.setValue(this.model.signo);
      this.vaultinc.setValue(this.model.vaultinc);
      this.quantity.setValue(this.model.quantity);
      this.quantity2.setValue(this.model.quantity2);
      this.total_amount.setValue(this.model.total_amount);
      this.tax_exempt.setValue(this.model.tax_exempt);
      this.disccount.setValue(this.model.disccount);
      this.head_invoice.setValue(this.model.head_invoice);
    } else {
      this.details.setValue('');
      this.details2.setValue('');
      this.signo.setValue(false);
      this.vaultinc.setValue(false);
      this.quantity.setValue(0);
      this.quantity2.setValue(0);
      this.total_amount.setValue(0);
      this.tax_exempt.setValue(false);
      this.disccount.setValue(0);  
      this.head_invoice.setValue('');
      if (this.headInvoiceId) {
        this.getHeadInvoiceById(this.headInvoiceId);
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
    model.head_invoice = this.model.head_invoice.id;
    
    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.detailInvoiceID) {
            this.hideModal();
          } else if(this.parent) {
            this.router.navigate([this.parent + '/invoiceitems']);
          } else {
            this.router.navigate(['/invoiceitems']);
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
      this.model = response.head_invoice
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;
    let model = this.model;
    model.head_invoice = this.model.head_invoice.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if (this.detailInvoiceID) {
            this.hideModal();
          } else if(this.parent) {
            this.router.navigate([this.parent + '/invoiceitems']);
          } else {
            this.router.navigate(['/invoiceitems']);
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

  getHeadInvoiceById(id) {
    this.headInvoiceService.getById(id).toPromise().then(
      response => {
        this.head_invoice.setValue(response.head_invoice);
      },
      error => {
        console.log('error getting head_invoice');
      }
    );
  }

  hideModal(){
    this.displayModal.emit()
  }
}