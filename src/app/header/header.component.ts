import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	title = 'Angular Gallery App';

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['login']);
    return false;

  }

}
