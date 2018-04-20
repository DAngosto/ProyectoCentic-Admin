import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
 
const httpOptions = {
    //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CardsService {
 
    constructor(private http:HttpClient) {}
 
    uploadImage(fd:FormData){

        let userToken= localStorage.getItem('tokenUser');
        let body= fd;
        let enviar = "Bearer " + userToken;
        let headers = new HttpHeaders().set('Authorization', enviar);
		return this.http.post('https://gameserver.centic.ovh/files',body, { headers: headers});
        
    }

    

    

}// END OF CardsService