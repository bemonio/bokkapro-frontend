import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
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
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
  };

  public code: AbstractControl;
  public code_brinks: AbstractControl;
  public name: AbstractControl;
  public contact: AbstractControl;
  public point_name: AbstractControl;
  public reference_point: AbstractControl;
  public telephone: AbstractControl;
  public email: AbstractControl;
  public description: AbstractControl;
  public type_location: AbstractControl;
  public address: AbstractControl;
  public company: AbstractControl;
  public zone: AbstractControl;
  public type_address: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;
  public optionsTypeAddress: { key: string, value: string }[];

  public companyId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      code_brinks: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      name: ['', Validators.compose([Validators.required])],
      contact: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      point_name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      reference_point: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      telephone: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      description: ['', Validators.compose([Validators.maxLength(255)])],
      type_location: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
      company: ['', Validators.compose([Validators.required])],
      zone: [''],
      type_address: [''],
    });
    this.code = this.formGroup.controls['code'];
    this.code_brinks = this.formGroup.controls['code_brinks'];
    this.name = this.formGroup.controls['name'];
    this.contact = this.formGroup.controls['contact'];
    this.point_name = this.formGroup.controls['point_name'];
    this.reference_point = this.formGroup.controls['reference_point'];
    this.telephone = this.formGroup.controls['telephone'];
    this.email = this.formGroup.controls['email'];
    this.description = this.formGroup.controls['description'];
    this.type_location = this.formGroup.controls['type_location'];
    this.address = this.formGroup.controls['address'];
    this.company = this.formGroup.controls['company'];
    this.zone = this.formGroup.controls['zone'];
    this.type_address = this.formGroup.controls['type_address'];
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.optionsTypeAddress = [
      {key: 'Origen', value: 'Origen'},
      {key: 'Destino', value: 'Destino'},
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
        return of({ 'location': new Model() });
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
        return of({ 'location': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
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
      this.contact.setValue(this.model.contact);
      this.point_name.setValue(this.model.point_name);
      this.reference_point.setValue(this.model.reference_point);
      this.telephone.setValue(this.model.telephone);
      this.email.setValue(this.model.email);
      this.description.setValue(this.model.description);
      this.type_address.setValue({ key: this.model.type_address, value: this.model.type_address });
      this.address.setValue(this.model.address);
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
    this.requesting = true;

    let model = this.model;
    model.type_location = this.model.type_location.id;
    model.company = this.model.company.id;
    model.zone = this.model.zone.id;
    model.type_address = this.type_address.value.value;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/locations']);
          } else {
            this.router.navigate(['/locations']);
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
      this.model = response.location
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;

    let model = this.model;
    model.type_location = this.model.type_location.id;
    model.company = this.model.company.id;
    model.zone = this.model.zone.id;
    model.type_address = this.type_address.value.value;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('top-right', 'success', 'success');
        if (this.saveAndExit) {
          if(this.parent){
            this.router.navigate([this.parent + '/locations']);
          } else {
            this.router.navigate(['/locations']);
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
      this.model = response.location as Model
      // if (this.saveAndExit) {
      //   if(this.parent){
      //     this.router.navigate([this.parent + '/locations']);
      //   } else {
      //     this.router.navigate(['/locations']);
      //   }
      // } else {
      //   this.formGroup.reset()
      // }
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
}
