import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { DivisionService } from 'src/app/pages/division/_services';

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
    public divisionService: DivisionService
  ) {
    this.divisions = [];
  }

  ngOnInit(): void {
    this.divisions = this.authService.currentUserValue.employee.divisions;
    this.division = this.authService.currentDivisionValue;
  }

  changeDivision(division) {
    this.authService.currentDivisionValue = division;
    this.divisionService._change$.next(true);
  }
}
