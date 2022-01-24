import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { DivisionService } from 'src/app/pages/division/_services';
import { CrewService } from './../../../../../pages/crew/_services/crew.service';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';

@Component({
  selector: 'app-dropdown-menu1',
  templateUrl: './dropdown-menu1.component.html',
})
export class DropdownMenu1Component implements OnInit {
  public divisions;
  public division;

  change$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    public divisionService: DivisionService,
    public crewService: CrewService,
    private toastService: ToastService
  ) {
    this.divisions = [];
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue.groups[0].id == 6) {
      this.getCrew();
    } else {
      this.divisions = this.authService.currentUserValue.employee.divisions;
      this.division = this.authService.currentDivisionValue;
    }
  }

  changeDivision(division) {
    this.authService.currentDivisionValue = division;
    this.divisionService._change$.next(true);
    this.divisionService._change$.next(false);
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
            this.divisions = response.divisions;
            this.changeDivision(response.divisions[0]);
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
