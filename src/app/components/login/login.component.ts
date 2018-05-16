import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public inputUser;
  public inputPassword;
  public errorValidating=false;

  constructor(private _authenticationService: AuthenticationService, private router:Router) { }

  ngOnInit() {
    
    
  
  }

  tryValidation(){
    this._authenticationService.validate(this.inputUser,this.inputPassword).subscribe(
      data => {
            let token = data['token'];
            localStorage.setItem('tokenUser', token);
            localStorage.setItem('username', this.inputUser);
            this.router.navigate(["/menu"]);
         },
         error => {
           this.errorValidating=true;
           return Observable.throw(error);
         }
    );

  }
  

}


