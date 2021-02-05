import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/auth-http/token-storage.service';
import { UserService } from 'src/app/pages/user/_services';
import { DivisionModel } from 'src/app/pages/division/_models/division.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  currentDivision$: Observable<DivisionModel>;
  currentDivisionSubject: BehaviorSubject<DivisionModel>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  get currentDivisionValue(): DivisionModel {
    return this.currentDivisionSubject.value;
  }

  set currentDivisionValue(division: DivisionModel) {
    this.currentDivisionSubject.next(division);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private token: TokenStorageService,
    private userService: UserService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
    this.currentDivisionSubject = new BehaviorSubject<DivisionModel>(undefined);
    this.currentDivision$ = this.currentDivisionSubject.asObservable();
  }

  // public methods
  login(username: string, password: string): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(username, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this.token.signOut();
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken().pipe(
      map((user: UserModel) => {
        if (user) {
          this.userService.getById(user.id).toPromise().then(
              response => {
                let model = response;
                if (response.employees) {
                  model.user.employee = response.employees[0];
                  if (response.positions) {
                    model.user.employee.position = response.positions[0];
                    if (response.departments) {
                      model.user.employee.position.department = response.departments[0];
                    }
                  }

                  if (response.divisions) {
                    model.user.employee.divisions = response.divisions;
                  }
                }

                if (response.groups) {
                  model.user.groups = response.groups;
                  if (response.permissions) {
                    model.user.groups[0].permissions = response.permissions;
                  }
                }

                this.currentUserSubject = new BehaviorSubject<UserModel>(model.user);
                this.currentDivisionSubject = new BehaviorSubject<DivisionModel>(model.user.employee.divisions[0]);
              },
              error => {
                console.log ('error getting user');
              }
          );
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.username, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(username: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(username)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      this.token.saveToken(JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      return this.token.getAuth();
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  public hasPermission (permission) {
    let has = false;
    const user = this.currentUserSubject.getValue();
    user.groups.forEach(elementGroup => {
      elementGroup.permissions.forEach(elementPermission => {
        if (elementPermission.codename === permission) {
          has = true;
        }
      });
    });
    return has;
  }
}
