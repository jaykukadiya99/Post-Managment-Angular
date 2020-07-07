import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from '../models/auth-data.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl :string = "http://localhost:3000/api/users";
  private token:string;
  private tokenTimer : any;
  private authStatusListner = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }

  createUser(email:string,password:string){
    const authData:AuthData = {email:email,password:password};
    this.http.post(this.baseUrl,authData)
      .subscribe(response=>{
        console.log(response);
      })
  }

  loginUser(email:string,password:string){
    const authData:AuthData = {email:email,password:password};
    this.http.post<{token:string,expiresIn:number}>(this.baseUrl+"/login",authData)
      .subscribe(response=>{
        this.token = response.token;
        if(this.token){
          this.isAuthenticated=true;
          this.authStatusListner.next(true);
          const expiresIn = response.expiresIn;
          this.tokenTimer = setTimeout(()=>{
            this.logout();
          },expiresIn * 1000);

          const now:Date = new Date();
          const expriesDate = new Date(now.getTime() + (expiresIn*1000));
          this.saveAuthData(this.token,expriesDate);

          this.router.navigate(['/']);
        }
      })
  }

  
  logout(){
    this.token=null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser(){
    const token = localStorage.getItem("token");
    const expiresIn = new Date(localStorage.getItem("expriesDate"));
    const isInFuture = expiresIn.getTime() - new Date().getTime() ; 
    if(!token || !expiresIn){
      return null;
    }
    if(isInFuture>0){
      this.isAuthenticated=true;
      this.authStatusListner.next(true);
      this.tokenTimer = setTimeout(()=>{
        this.logout();
      },isInFuture);      
    }
  }
  private saveAuthData(token:string,expriesDate:Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expriesDate",expriesDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expriesDate");
  }
}
