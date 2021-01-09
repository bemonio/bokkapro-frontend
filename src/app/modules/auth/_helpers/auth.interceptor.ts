import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { TokenStorageService } from '../_services/auth-http/token-storage.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService,
    private authService: AuthService) { }

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

    //send the newly created request
    return next.handle(authReq)
    .pipe(
      catchError(err => {
        // onError
        console.log(err);
        if (err instanceof HttpErrorResponse) {
            console.log(err.status);
            console.log(err.statusText);
            if (err.status === 401) {
              this.authService.logout();
            }
        }
        return Observable.throw(err);
      }) as any
    )
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];