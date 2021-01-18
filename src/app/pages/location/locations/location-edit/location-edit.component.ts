import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { LocationModel as Model } from '../../_models/location.model';
import { LocationService as ModelsService } from '../../_services/location.service';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent implements OnInit, OnDestroy {
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
  public name: AbstractControl;
  public description: AbstractControl;
  public type_location: AbstractControl;
  public company: AbstractControl;
  public zone: AbstractControl;

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
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      code_brinks: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      description: ['', Validators.compose([Validators.maxLength(30)])],
      type_location: ['', Validators.compose([Validators.required])],
      company: ['', Validators.compose([Validators.required])],
      zone: ['', Validators.compose([Validators.required])],
    });
    this.code = this.formGroup.controls['code'];
    this.code_brinks = this.formGroup.controls['code_brinks'];
    this.name = this.formGroup.controls['name'];
    this.description = this.formGroup.controls['description'];
    this.type_location = this.formGroup.controls['type_location'];
    this.company = this.formGroup.controls['company'];
    this.zone = this.formGroup.controls['zone'];
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
        return of({'location':new Model()});
      }),
      catchError((error) => {
        this.loading = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of({'location':new Model()});
      }),
    ).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.model = response.location;
        if (response.type_locations) {
          this.model.type_location = response.type_locations[0];
        }
        if (response.companies) {
          this.model.company = response.companies[0];
        }
        if (response.zones) {
          this.model.zone = response.zones[0];
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
      this.code_brinks.setValue(this.model.code_brinks);
      this.name.setValue(this.model.name);
      this.description.setValue(this.model.description);
      if (this.model.type_location) {
        this.type_location.setValue(this.model.type_location);
      }
      if (this.model.company) {
        this.company.setValue(this.model.company);
      }
      if (this.model.zone) {
        this.zone.setValue(this.model.zone);
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
    this.loading = true;

    let model = this.model;
    model.type_location = this.model.type_location.id;
    model.company = this.model.company.id;
    model.zone = this.model.zone.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/locations']);
        }
      }),
      catchError((error) => {
        this.loading = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.location
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.loading = true;

    let model = this.model;
    model.type_location = this.model.type_location.id;
    model.company = this.model.company.id;
    model.zone = this.model.zone.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          this.router.navigate(['/locations']);
        }
      }),
      catchError((error) => {
        this.loading = false;
        Object.entries(error.error).forEach(
          ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.loading = false;
      this.model = response.location as Model
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
