import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl :string = "http://localhost:3000/api/users";
  private token:string;
  constructor(private http:HttpClient) { }

  getToken(){
    return this.token;
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
      })
  }
}
