import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { Card } from '../interfaces/Card';

 
const httpOptions = {
    //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CardsService {
 
    constructor(private http:HttpClient) {}
 
    uploadFile(fd:FormData){
        let userToken= localStorage.getItem('tokenUser');
        let body= fd;
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders().set('Authorization', authorization);
            
		return this.http.post('https://gameserver.centic.ovh/files',body, { headers: headers });
    }

    /*  //De momento no es necesario
    getFile(url){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Authorization', authorization);
        return this.http.get('https://gameserver.centic.ovh' + url);

        
        //return this.http.get('https://gameserver.centic.ovh' + url, { headers: headers });
    }
    */

    uploadCard(name, history, tags, fileURL){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        let message = {
                "name": name,
                "history": history,
                "tags": tags,
                "fileURL": fileURL,
                "itemType": "0",   //0 = carta , 1 = colección
                "publish": false
        }
        let body= JSON.stringify(message);
        return this.http.post('https://gameserver.centic.ovh/items/',body, { headers: headers });
    }

    getAllItems(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get<Card[]>('https://gameserver.centic.ovh/items', { headers: headers });
    }

    deleteItem(id){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.delete('https://gameserver.centic.ovh/items/' + id, { headers: headers });
    }

    

    

    

}// END OF CardsService