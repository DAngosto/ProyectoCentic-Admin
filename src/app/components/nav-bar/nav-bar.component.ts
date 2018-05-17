//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  username;
  
  constructor(private _authenticationService: AuthenticationService, private router:Router) { }

  ngOnInit() {
    this.username=localStorage.getItem('username');
  }

  disconnect(){
    this._authenticationService.logout();
    this.router.navigate(["/login"]);
  }

}/// END OF COMPONENT NavBarComponent ///
