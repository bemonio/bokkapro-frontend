import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '../../../modules/i18n/translation.service';
import { UserService } from 'src/app/pages/user/_services';
import { ToastService } from '../../toast/_services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   username: '',
  //   password: '',
  // };
  defaultAuth: any = {
    username: '@brinks.com',
    password: '',
    };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
        this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [
        this.defaultAuth.username,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-username-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe((auth: any) => {
        this.authService
        .getUserByToken()
        .pipe(first())
        .subscribe((userAuth: any) => {  
          if (userAuth){
            this.userService.getById(userAuth.id)
            .pipe(first())
            .subscribe((user: any) => {  
              let model = user;
              if (user.employees) {
                model.user.employee = user.employees[0];
                if (user.positions) {
                  model.user.employee.position = user.positions[0];
                  if (user.departments) {
                    model.user.employee.position.department = user.departments[0];
                  }
                }
  
                if (user.divisions) {
                  model.user.employee.divisions = user.divisions;
                }
              }
  
              if (user.groups) {
                model.user.groups = user.groups;
                if (user.permissions) {
                  model.user.groups[0].permissions = user.permissions;
                }
              }
  
              if (model.user.employee) {
                if (model.user.employee.divisions) {
                  this.authService.currentDivisionValue = model.user.employee.divisions[0];
                }
              }
  
              if (model.user.language) {
                this.translationService.setLanguage(model.user.language);
              } else {
                this.translationService.setLanguage('es');
              }
              this.authService.currentUserValue = model.user;
  
              this.router.navigate(['/dashboard']);
            });
          } else {
            this.toastService.growl('error', 'error');
            this.hasError = true;
          }
        }); 
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
