import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl :string = "http://localhost:3000/api/users";
  
  constructor(private http:HttpClient) { }

  createUser(email:string,password:string){
    const authData:AuthData = {email:email,password:password};
    this.http.post(this.baseUrl,authData)
      .subscribe(response=>{
        console.log(response);
      })
  }

  loginUser(email:string,password:string){
    const authData:AuthData = {email:email,password:password};
    this.http.post(this.baseUrl+"/login",authData)
      .subscribe(response=>{
        console.log(response);
      })
  }
}
