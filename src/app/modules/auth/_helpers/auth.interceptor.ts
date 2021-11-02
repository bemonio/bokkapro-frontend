import { AuthService } from './../_services/auth.service';
import { HTTP_INTERCEPTORS, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/auth-http/token-storage.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private token: TokenStorageService,
    private router: Router,
    private injector: Injector
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      if (!req.headers.has('Content-Type')) {
        authReq = req.clone({setHeaders: {'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'}});
      } else {
        authReq = req.clone({setHeaders: {'Authorization': `Bearer ${token}`}});
      }
    } else {
      if (!req.headers.has('Content-Type')) {
        authReq = req.clone({setHeaders: {'Content-Type': 'application/json'}});
      }
    }

    return next.handle(authReq).pipe(tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // redirect to the login route
            this.logout();
            this.router.navigate(['login']);
          }
        }
      })
    );
  }

  logout() {
    const authService = this.injector.get(AuthService);
    authService.logout();
    document.location.reload();
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];