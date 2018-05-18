//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/observable';

//SERVICES
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public inputUser;
  public inputPassword;

  //Alarm Conditions
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
            this.router.navigate(["/dashboard"]);
         },
         error => {
           this.errorValidating=true;
           return Observable.throw(error);
         }
      );
    }
     
}/// END OF COMPONENT LoginComponent ///


