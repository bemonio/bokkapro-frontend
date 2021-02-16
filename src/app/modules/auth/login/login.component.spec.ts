// https://codecraft.tv/courses/angular/unit-testing/model-driven-forms/
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { UserModel } from '../_models/user.model';
import { LogoutComponent } from '../logout/logout.component';
import { TranslationModule } from '../../i18n/translation.module';
import { TranslateModule } from '@ngx-translate/core';

const fakeAuth = {
  username: '@brinks.com',
  password: '',
};

const mockActivatedRoute = {
  snapshot: {
    params: {},
    queryParams: {},
  },
};

const fakeRoutes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/logout', component: LogoutComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];

class FakeAuthService {
  login(username: string, password: string): Observable<UserModel> {
    const isChecked =
      username === fakeAuth.username && password === fakeAuth.password;
    if (!isChecked) {
      return of(undefined);
    }

    const user = new UserModel();
    user.username = '';
    user.password = '';
    user.username = '';
    return of(user);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let injector;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot(fakeRoutes),
        TranslateModule.forRoot(),
      ],
      declarations: [LoginComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    }).compileComponents();

    injector = getTestBed();
    authService = injector.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form valid with default data', () => {
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('username field validity', () => {
    let errors = {};
    const username = component.loginForm.controls['username'];
    expect(username.valid).toBeTruthy();

    // Email field is required
    // Set empty username first
    username.setValue('');
    errors = username.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set username to something
    username.setValue('te');
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['username']).toBeTruthy();
    expect(errors['minlength']).toBeTruthy();

    // Set username to something correct
    username.setValue('test@example.com');
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['username']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
    expect(errors['maxlength']).toBeFalsy();
  });

  it('password field validity', () => {
    let errors;
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeTruthy();
    password.setValue('12');
    expect(password.value).toBe('12');
    errors = password.errors || {};
    expect(errors['minlength']).toBeTruthy();

    password.setValue('');
    expect(password.value).toBe('');
    expect(password.valid).toBeFalsy();
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set password to something correct
    password.setValue('123456789');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
    expect(errors['maxlength']).toBeFalsy();
  });
});
