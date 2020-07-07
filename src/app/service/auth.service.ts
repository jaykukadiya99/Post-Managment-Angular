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
    this.http.post<{token:string}>(this.baseUrl+"/login",authData)
      .subscribe(response=>{
        this.token = response.token;
        if(this.token){
          this.isAuthenticated=true;
          this.authStatusListner.next(true);
          this.router.navigate(['/']);
        }
      })
  }

  
  logout(){
    this.token=null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
  }
}
