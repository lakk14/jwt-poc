import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private baseURL = 'http://localhost:3200/api/'
  constructor(private http: HttpClient, private router: Router) { }

  loginUser(loginData: Login) {
    return this.http.post<any>(this.baseURL + 'login', loginData);
  }

  getUser(jwt: String, email: String) {
    var headers_object = new HttpHeaders().set("Authorization", "" + jwt);
    return this.http.get<any>(this.baseURL + 'user/' + email, {headers: headers_object });
  }
}
