import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class AuthenticationService {
 
    constructor(private http:HttpClient) {}
 

    validate(user, password) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        
        let message = {
          "user": user,
          "password": password
        }
      let body= JSON.stringify(message);
      return this.http.post('https://gameserver.centic.ovh/auth/login',body, { headers: headers});
    }

    logout(): void {

        localStorage.removeItem('tokenUser');

    }

}// END OF AuthenticationService