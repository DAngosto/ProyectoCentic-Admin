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

    uploadCard(name, history, tags, fileURL){

        let userToken= localStorage.getItem('tokenUser');
        let enviar = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', enviar);
        let message = {
                "name": name,
                "history": history,
                "tags": tags,
                "fileURL": fileURL,
                "itemType": "0",   //0 = carta , 1 = colección
                "publish": false
        }
        let body= JSON.stringify(message);
        return this.http.post('https://gameserver.centic.ovh/items/',body, { headers: headers});
    }

    

    

}// END OF CardsService