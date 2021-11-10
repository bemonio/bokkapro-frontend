import { OriginDestinationComponent } from './../../../origin-destination/origin-destination.component';
import { Component, Input, Output, OnDestroy, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { TourDetailModel as Model } from '../../_models/tour-detail.model';
import { TourDetailService as ModelsService } from '../../_services/tour-detail.service';
import { OriginDestinationService } from 'src/app/pages/origin-destination/_services';

@Component({
  selector: 'app-tour-detail-edit',
  templateUrl: './tour-detail-edit.component.html',
  styleUrls: ['./tour-detail-edit.component.scss']
})
export class TourDetailEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tourDetailID: { id: number, isNew: boolean};
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public id: number;
  public model: Model;
  public previous: Model;
  public formGroup: FormGroup;
  public requesting: boolean = false;

  public tabs = {
    BASIC_TAB: 0,
    PROFILE: 1,
  };

  public date_start: AbstractControl;
  public date_end: AbstractControl;
  public origin_destination: AbstractControl;
  public division: AbstractControl;

  public activeTabId: number;
  private subscriptions: Subscription[] = [];

  public saveAndExit;

  public originDestinationId: number;
  public parent: string;

  constructor(
    private fb: FormBuilder,
    private modelsService: ModelsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private originDestinationService: OriginDestinationService,
  ) {
    this.activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Profile
    this.saveAndExit = false;
    this.requesting = false;

    this.formGroup = this.fb.group({
    });
  }

  ngOnInit(): void {
    this.id = undefined;
    this.model = undefined;
    this.previous = undefined;

    this.formGroup = this.fb.group({
      date_start: ['', Validators.compose([Validators.required,])],
      date_end: ['', Validators.compose([Validators.required,])],
      origin_destination: ['', Validators.compose([Validators.required,])],
      division: ['', Validators.compose([Validators.required,])],
    });

    this.date_start = this.formGroup.controls['date_start'];
    this.date_end = this.formGroup.controls['date_end'];
    this.origin_destination = this.formGroup.controls['origin_destination'];
    this.division = this.formGroup.controls['division'];

    if (this.tourDetailID){
      if(this.tourDetailID.id){
        this.id = this.tourDetailID.id; 
        this.get();
      } else {
        this.id = undefined;
        this.get();
      }
    } 
    this.route.parent.parent.parent.params.subscribe((params) => {
      if (this.route.parent.parent.parent.parent.parent.snapshot.url.length > 0) {
        this.originDestinationId = params.id;
        this.parent = '/' + this.route.parent.parent.parent.parent.parent.snapshot.url[0].path + '/edit/' + this.originDestinationId;
      }
      this.get();
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  get() {
    this.requesting = true;
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        if(!this.tourDetailID){
          this.id = Number(params.get('id'));
        }
        if (this.id || this.id > 0) {
          return this.modelsService.getById(this.id);
        }
        return of({ 'tour_detail': new Model() });
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of({ 'tour': new Model() });
      }),
    ).subscribe((response: any) => {
      this.requesting = false;
      if (response) {
        this.model = response.tour_detail;
        if(response.origin_destinations){
          response.origin_destinations.forEach(origin_destination => {
              if(this.model.origin_destination) {
                  if (this.model.origin_destination === origin_destination.id) {
                      this.model.origin_destination = origin_destination;
                  }
              }
          });
        }
        if(response.locations){
          response.locations.forEach(location => {
              if(this.model.origin_destination) {
                  if (this.model.origin_destination.origin === location.id) {
                      this.model.origin_destination.origin = location;
                  }
              }
          });
        }
        if(response.locations){
          response.locations.forEach(location => {
              if(this.model.origin_destination) {
                  if (this.model.origin_destination.destination === location.id) {
                      this.model.origin_destination.destination = location;
                  }
              }
          });
        }
        if(response.divisions){
          response.divisions.forEach(division => {
              if(this.model.origin_destination) {
                  if (this.model.origin_destination.division === division.id) {
                      this.model.origin_destination.division = division;
                  }
              }
              if (this.model.division === division.id) {
                this.model.division = division;
              }
          });
        }

        this.previous = Object.assign({}, this.model);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (this.model && this.model.id) {
      this.date_start.setValue(new Date(this.model.date_start));
      this.date_end.setValue(new Date(this.model.date_end));
      if (this.model.origin_destination) {
        this.origin_destination.setValue(this.model.origin_destination);
      }
      if (this.model.division) {
        this.division.setValue(this.model.division);
      }
    } else {
      if (this.originDestinationId) {
        this.getOriginDestinationById(this.originDestinationId);
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
    model.date_start = this.formatDate(this.date_start.value);
    model.date_end = this.formatDate(this.date_end.value);
    model.origin_destination = this.model.origin_destination.id;
    model.division = this.model.division.id;

    const sbUpdate = this.modelsService.patch(this.id, model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          // this.router.navigate(['/tours']);
          this.emitHideModal();
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.tour
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.requesting = true;

    let model = this.model;
    model.date_start = this.formatDate(this.date_start.value);
    model.date_end = this.formatDate(this.date_end.value);
    model.origin_destination = this.model.origin_destination.id;
    model.division = this.model.division.id;

    const sbCreate = this.modelsService.post(model).pipe(
      tap(() => {
        this.toastService.growl('success', 'success');
        if (this.saveAndExit) {
          // this.router.navigate(['/tours']);
          this.emitHideModal();
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
          ([key, value]) => this.toastService.growl('error', key + ': ' + value)
        );
        return of(this.model);
      })
    ).subscribe(response => {
      this.requesting = false;
      this.model = response.tour as Model
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

  getOriginDestinationById(id) {
    this.originDestinationService.getById(id).toPromise().then(
      response => {
        this.origin_destination.setValue(response.origindestination)
        this.division.setValue(response.division)
      },
      error => {
        console.log('error getting division');
      }
    );
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

  emitHideModal(){
    this.hideModal.emit();
  }
}
