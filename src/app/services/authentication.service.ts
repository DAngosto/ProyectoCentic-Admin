import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router'
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class AuthenticationService {
 
    constructor(private http:HttpClient, private router: Router) {}
 

    validate(user, password) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let message = {
          "user": user,
          "password": password
        }
      let body= JSON.stringify(message);
      return this.http.post('https://gameserver.centic.ovh/auth/login',body, { headers: headers});
    }

    isUserValidated(){
        if (localStorage.getItem('tokenUser')) {
            return true;
        }         
        this.router.navigate(['/login']);
        return false;
    }


    logout(): void {
        localStorage.removeItem('tokenUser');
    }

}// END OF AuthenticationService