import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { Card } from '../interfaces/Card';
import { Collection } from '../interfaces/Collection';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

 
const httpOptions = {
    //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class DataService {
    
    card: Card;
    private messageSource = new BehaviorSubject<Card>(this.card);
    currentCardUpdating = this.messageSource.asObservable();

    constructor(private http:HttpClient) {}

    //METODOS COMUNES///

    uploadFile(fd:FormData){
        let userToken= localStorage.getItem('tokenUser');
        let body= fd;
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders().set('Authorization', authorization);
            
		return this.http.post('https://gameserver.centic.ovh/files',body, { headers: headers });
    }

    getAllItems(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get<Card[]>('https://gameserver.centic.ovh/items', { headers: headers });
    }

    getAllItemsCollection(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get<Collection[]>('https://gameserver.centic.ovh/items', { headers: headers });
    }

    getItem(id){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get('https://gameserver.centic.ovh/items/' + id, { headers: headers });
    }

    deleteItem(id){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.delete('https://gameserver.centic.ovh/items/' + id, { headers: headers });
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



    //METODOS PARA CARDS///

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

    
    updateCard(card: Card){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        let message = {
                "name": card.name,
                "history": card.history,
                "tags": card.tags,
                "fileURL": card.fileURL,
                "itemType": "0",   //0 = carta , 1 = colección
                "publish": card.publish
        }
        let body= JSON.stringify(message);
        return this.http.put('https://gameserver.centic.ovh/items/' + card._id,body, { headers: headers });
    }

    
    changeCard(card: Card) {
        this.messageSource.next(card);
    }
    

    //METODOS PARA COLLECTIONS///

    /* Estructura de una coleccion
    _id: string;
    name: string;
    cards: string;
    fileURL: string;
    itemType: string;
    publish: boolean;
    */

    uploadCollection(name, cards){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        let message = {
                "name": name,
                "cards": cards,
                "itemType": "1",   //0 = carta , 1 = colección
                "publish": false
        }
        let body= JSON.stringify(message);
        return this.http.post('https://gameserver.centic.ovh/items/',body, { headers: headers });
    }

}// END OF DataService