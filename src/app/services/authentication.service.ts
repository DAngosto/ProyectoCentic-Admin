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
 
    /*
    EN:Function in charge of checking the user's credentials against the API.
    ES:Función encargada de comprobar las credenciales del usuario contra la API.
    */
    validate(user, password) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let message = {
          "user": user,
          "password": password
        }
      let body= JSON.stringify(message);
      return this.http.post(AppSettings.API_ENDPOINT_LOGIN,body, { headers: headers});
    }

    /*
    EN:Function in charge of checking if the user has logged into the application.
    ES:Función encargada de comprobar si el usuario se ha logueado en la aplicación.
    */
    isUserValidated(){
        if (localStorage.getItem('tokenUser')) {
            return true;
        }else{
            return false;
        }         
    }

    /*
    EN:Function in charge of disconnecting the user from the application by deleting its validation token.
    ES:Función encargada de desconectar al usuario de la aplicación borrando su token de validación.
    */
    logout(): void {
        localStorage.removeItem('tokenUser');
    }

}// END OF SERVICE AuthenticationService