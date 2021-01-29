import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

const API_AUTH_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(username: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_AUTH_URL}auth/token`,   { username, password });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_AUTH_URL, user);
  }

  // Your server should check username => If username exists send link to the user and return true | If username doesn't exist return false
  forgotPassword(username: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_AUTH_URL}auth/forgot-password`, {
      username,
    });
  }

  getUserByToken(): Observable<UserModel> {
    return this.http.get<UserModel>(`${API_AUTH_URL}auth/user`);
  }
}
