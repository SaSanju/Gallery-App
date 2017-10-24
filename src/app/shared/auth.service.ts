import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	user: any;
  authToken: any;

  private authUrl = 'http://localhost:3000/api/';

  constructor(private http:Http) { }

  authenticateUser(username, password){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(this.authUrl + 'login', JSON.stringify({username: username,password: password}), {headers: headers})
          .map(
              res => res.json(),
              err => console.log(err)
            );
  }

  registerUser(username, password){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(this.authUrl + 'register', JSON.stringify({username: username,password: password}), {headers: headers})
          .map(
              res => res.json(),
              err => console.log(err)
            );
  }

  storeUserData(username, token){
    localStorage.setItem('uname', username);
    localStorage.setItem('token', token);
    this.authToken = token;
  }
  
  loggedIn(){
    return tokenNotExpired();
  }

  logout(){
    this.authToken = null;
    localStorage.clear();

  }

}
