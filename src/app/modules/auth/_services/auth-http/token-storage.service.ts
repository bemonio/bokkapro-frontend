import { Injectable } from '@angular/core';
import { AuthModel } from '../../_models/auth.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getAuth(): AuthModel {
    let authModel = new AuthModel();
    if (localStorage.getItem(TOKEN_KEY)) {
      authModel.accessToken = this.getToken();
      authModel.refreshToken = this.getRefreshToken();
    }
    return authModel;
  }

  public getToken(): string {
    let token = undefined;
    if (localStorage.getItem(TOKEN_KEY))
    {
      token = JSON.parse(localStorage.getItem(TOKEN_KEY)).accessToken;
    }
    return token;
  }

  public getRefreshToken(): string {
    let token = undefined;
    if (localStorage.getItem(TOKEN_KEY))
    {
      token = JSON.parse(localStorage.getItem(TOKEN_KEY)).refreshToken;
    }
    return token;
  }

  public saveUser(user): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }
}