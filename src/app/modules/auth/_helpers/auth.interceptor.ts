import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/auth-http/token-storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) { }

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
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];