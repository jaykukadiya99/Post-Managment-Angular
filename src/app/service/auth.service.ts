import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from "./../../environments/environment";
import { AuthData } from '../models/auth-data.model';
import { Router } from '@angular/router';

const BASE_URL: string = environment.apiUrl + "users/";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private token: string;
  private tokenTimer: any;
  private userId:string;
  private authStatusListner = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId(){
    return this.userId;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BASE_URL, authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      },error =>{
        // alert("Somthiing goes wrong");
      })
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number,userId:string }>(BASE_URL + "login", authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const expiresIn = response.expiresIn;
          this.userId = response.userId;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresIn * 1000);

          const now: Date = new Date();
          const expriesDate = new Date(now.getTime() + (expiresIn * 1000));
          this.saveAuthData(this.token, expriesDate,this.userId);

          this.router.navigate(['/']);
        }
      },error =>{
        // alert("Somthiing goes wrong");
      });
  }


  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    this.token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    const expiresIn = new Date(localStorage.getItem("expriesDate"));
    const isInFuture = expiresIn.getTime() - new Date().getTime();
    if (!this.token || !expiresIn) {
      return null;
    }
    // console.log(token,expiresIn);
    if (isInFuture > 0) {
      this.isAuthenticated = true;
      this.authStatusListner.next(true);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, isInFuture);
    }
  }
  private saveAuthData(token: string, expriesDate: Date,userId:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expriesDate", expriesDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expriesDate");
    localStorage.removeItem("userId");
  }
}
