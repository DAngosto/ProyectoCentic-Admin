//MODULES
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router'

//SETTINGS
import {AppSettings} from '../AppSettings';
 
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
      return this.http.post(AppSettings.API_ENDPOINT_LOGIN,body, { headers: headers});
    }

    isUserValidated(){
        if (localStorage.getItem('tokenUser')) {
            return true;
        }else{
            return false;
        }         
    }

    logout(): void {
        localStorage.removeItem('tokenUser');
    }

}// END OF SERVICE AuthenticationService