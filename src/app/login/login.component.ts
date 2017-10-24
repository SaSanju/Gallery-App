import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	username: String;
	password: String;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }
  onLogin(){

    let username = this.username; 
    let password = this.password;
    
    console.log(username);

    this.authService.authenticateUser(username, password)

    .subscribe(data => {
    if(data.success){
      console.log(data);
      this.router.navigate(['gallery']);
      this.authService.storeUserData(data.username, data.token);

    }
    else{
      console.log(data);
      this.router.navigate(['login']);
    }

    });


  }

}
