//MODULES
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

//SERVICES
import { AuthenticationService } from './services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _authenticationService: AuthenticationService, private router:Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this._authenticationService.isUserValidated()){
      return true;
    }else{
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
