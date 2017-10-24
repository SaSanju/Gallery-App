import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	username: String;
	password: String;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onRegister(){

    let username = this.username; 
    let password = this.password;
    
    console.log(username);

    this.authService.registerUser(username, password)

    .subscribe(data => {
    if(data.success){
      this.router.navigate(['login']);
    }
    });
   }

}
