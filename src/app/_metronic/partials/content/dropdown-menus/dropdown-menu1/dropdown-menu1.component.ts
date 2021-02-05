import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-dropdown-menu1',
  templateUrl: './dropdown-menu1.component.html',
})
export class DropdownMenu1Component implements OnInit {
  public divisions;
  public division;

  constructor(
    public authService: AuthService
  ) {
    this.divisions = [];
  }

  ngOnInit(): void {
    this.divisions = this.authService.currentUserValue.employee.divisions;
    this.division = this.authService.currentDivisionValue;
  }

  changeDivision(division) {
    console.log(division);
    this.authService.currentDivisionValue = division;
  }
}
