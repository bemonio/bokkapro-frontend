import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { TypeCompanyModel as Model } from '../../_models/type-company.model';
import { TypeCompanyService as ModelsService } from '../../_services/type-company.service';

@Component({
  selector: 'app-type-company-edit',
  templateUrl: './type-company-edit.component.html',
  styleUrls: ['./type-company-edit.component.scss']
})
export class TypeCompanyEditComponent implements OnInit, OnDestroy {
  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public loading: boolean;

  public tabs = {
    BASIC_TAB: 0,
  };

  public name: AbstractControl;
  public description: AbstractControl;  

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {  
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.loading = false;

    this.formGroup = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.maxLength(30)])],
    });
    this.name = this.formGroup.controls['name'];
    this.description = this.formGroup.controls['description'];
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
        return of({'type_company':new Model()});
      }),
      catchError((error) => {
        this.toastService.growl('error', error);
        return of({'type_company':new Model()});
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.model = response.type_company;
        this.previous = Object.assign({}, response.type_company);
        this.loadForm();  
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model) {
      this.name.setValue(this.model.name);
      this.description.setValue(this.model.description);
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
    this.loading = true;
    const sbUpdate = this.modelsService.patch(this.id, this.model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/typescompanies']);
        }
      }),
      catchError((error) => {
        this.toastService.growl('error', error);
        console.error('UPDATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.type_company
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.loading = true;
    const sbCreate = this.modelsService.post(this.model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/typescompanies']);
        }
      }),
      catchError((error) => {
        this.toastService.growl('error', error);
        console.error('CREATE ERROR', error);
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.type_company as Model
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
}
