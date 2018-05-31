//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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

  constructor(private _authenticationService: AuthenticationService, private router:Router, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  /*
  EN:Function in charge of validating the user against the API.
  ES:Función encargada de realizar la validación del usuario contra la API.
  */
  tryValidation(){
    this._authenticationService.validate(this.inputUser,this.inputPassword).subscribe(
      data => {
            let token = data['token'];
            localStorage.setItem('tokenUser', token);
            localStorage.setItem('username', this.inputUser);
            this.router.navigate(["/dashboard"]);
         },
         error => {
           this.toastr.error("Usuario o contraseña incorrectos");
           return Observable.throw(error);
         }
      );
    }
     
}/// END OF COMPONENT LoginComponent ///


