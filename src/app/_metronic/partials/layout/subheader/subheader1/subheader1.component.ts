import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../core';
import { SubheaderService } from '../_services/subheader.service';
import { BreadcrumbItemModel } from '../_models/breadcrumb-item.model';
import { AuthService } from 'src/app/modules/auth';
import { CrewService } from './../../../../../pages/crew/_services/crew.service';

@Component({
  selector: 'app-subheader1',
  templateUrl: './subheader1.component.html',
})
export class Subheader1Component implements OnInit {
  subheaderCSSClasses = '';
  subheaderContainerCSSClasses = '';
  subheaderMobileToggle = false;
  subheaderDisplayDesc = false;
  subheaderDisplayDaterangepicker = false;
  title$: Observable<string>;
  breadcrumbs$: Observable<BreadcrumbItemModel[]>;
  breadcrumbs: BreadcrumbItemModel[] = [];
  description$: Observable<string>;
  @Input() title: string;

  public showCrew: boolean;
  public employees: any[];

  constructor(
    private layout: LayoutService,
    private subheader: SubheaderService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    public crewService: CrewService,
    private toastService: ToastService
  ) {
    this.title$ = this.subheader.titleSubject.asObservable();
    this.employees = [];
  }

  ngOnInit() {
    this.title$ = this.subheader.titleSubject.asObservable();
    this.breadcrumbs$ = this.subheader.breadCrumbsSubject.asObservable();
    this.description$ = this.subheader.descriptionSubject.asObservable();
    this.subheaderCSSClasses = this.layout.getStringCSSClasses('subheader');
    this.subheaderContainerCSSClasses = this.layout.getStringCSSClasses(
      'subheader_container'
    );
    this.subheaderMobileToggle = this.layout.getProp('subheader.mobileToggle');
    this.subheaderDisplayDesc = this.layout.getProp('subheader.displayDesc');
    this.subheaderDisplayDaterangepicker = this.layout.getProp(
      'subheader.displayDaterangepicker'
    );
    this.breadcrumbs$.subscribe((res) => {
      this.breadcrumbs = res;
      this.cdr.detectChanges();
    });
    if (this.authService.currentUserValue.groups[0].id == 6) {
      this.getCrew();
      this.showCrew = true;
    } else{
      this.showCrew = false;
    }
  }

  getNow() {
    return new Date();
  }

  getCrew() {
    let page = 1;
    let per_page = 100;
    let sort = undefined;
    let query = undefined;
    let _with = undefined;
    let filters = [];

    const today = new Date();
    const date = today.getFullYear()  + '-'+ String(today.getMonth() + 1).toString().padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    filters.push({ key: 'driver', value: this.authService.currentUserValue.employee.id });
    filters.push({ key: 'filter{date.icontains}[]', value: date });

    this.crewService.get(page, per_page, sort, query, filters, _with).subscribe(
        response => {
            this.employees = response.employees;
        },
        error => {
            let messageError = [];
            if (!Array.isArray(error.error)) {
                messageError.push(error.error);
            } else {
                messageError = error.error;
            }
            Object.entries(messageError).forEach(
                ([key, value]) => this.toastService.growl('top-right', 'error', key + ': ' + value)
            );
        }
    );
  }  
}
