//MODULES
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//INTERFACES
import { Card } from '../interfaces/Card';
import { Collection } from '../interfaces/Collection';
import { Config } from '../interfaces/Config';
import { GamePlayed } from '../interfaces/GamePlayed';

//SETTINGS
import {AppSettings} from '../AppSettings';
 
@Injectable()
export class DataService {
    
    card: Card;
    private messageSource = new BehaviorSubject<Card>(this.card);
    currentCardUpdating = this.messageSource.asObservable();

    collection: Collection;
    private messageSource2 = new BehaviorSubject<Collection>(this.collection);
    currentCollectionUpdating = this.messageSource2.asObservable();

    constructor(private http:HttpClient) {}

    //COMMON METHODS///

    uploadFile(fd:FormData){
        let userToken= localStorage.getItem('tokenUser');
        let body= fd;
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders().set('Authorization', authorization); 
		return this.http.post(AppSettings.API_ENDPOINT_FILES,body, { headers: headers });
    }

    getAllItems(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get<Card[]>(AppSettings.API_ENDPOINT_ITEMS, { headers: headers });
    }

    getAllItemsCollection(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get<Collection[]>(AppSettings.API_ENDPOINT_ITEMS, { headers: headers });
    }

    getAllItemsGamesPlayed(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get<GamePlayed[]>(AppSettings.API_ENDPOINT_ITEMS, { headers: headers });
    }

    getItem(id){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get(AppSettings.API_ENDPOINT_ITEMS + '/' + id, { headers: headers });
    }

    deleteItem(id){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.delete(AppSettings.API_ENDPOINT_ITEMS + '/' + id, { headers: headers });
    }

    //CARD METHODS///

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
        return this.http.post(AppSettings.API_ENDPOINT_ITEMS + '/',body, { headers: headers });
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
        return this.http.put(AppSettings.API_ENDPOINT_ITEMS + '/' + card._id,body, { headers: headers });
    }

    changeCard(card: Card) {
        this.messageSource.next(card);
    }

    //COLLECTION METHODS///

    uploadCollection(name, gamemode, cards){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        let message = {
                "name": name,
                "cards": cards,
                "gamemode": gamemode, //0 = arcade , 1 = survival
                "itemType": "1",   //0 = carta , 1 = colección
                "publish": false
        }
        let body= JSON.stringify(message);
        return this.http.post(AppSettings.API_ENDPOINT_ITEMS + '/',body, { headers: headers });
    }

    updateCollection(collection: Collection){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        let message = {
                "name": collection.name,
                "cards": collection.cards,
                "gamemode": collection.gamemode, //0 = arcade , 1 = survival
                "itemType": "1",   //0 = carta , 1 = colección
                "publish": collection.publish
        }
        let body= JSON.stringify(message);
        return this.http.put(AppSettings.API_ENDPOINT_ITEMS + '/' + collection._id,body, { headers: headers });
    }

    changeCollection(collection: Collection) {
        this.messageSource2.next(collection);
    }

    //CONFIG METHODS///

    updateConfigPoints(gamemode, type, value){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        var message;
        if(gamemode==0){
            if(type==0){
                message = {
                    "arcadesuccesspoints" : value 
                }
            }
            else if(type==1){
                message = {
                    "arcadefailpoints" : value 
                }
            } 
        }
        else if (gamemode==1){
            if(type==2){
                var aux = value;
                if(value<5){
                    aux = 5;
                }
                message = {
                    "survivallives" : aux 
                }
            }
        }
        let body= JSON.stringify(message);
        return this.http.put(AppSettings.API_ENDPOINT_CONFIG,body, { headers: headers });
    }

    getConfig(){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        return this.http.get(AppSettings.API_ENDPOINT_CONFIG,{ headers: headers });

    }

    updateConfigCardCover(url){
        let userToken= localStorage.getItem('tokenUser');
        let authorization = "Bearer " + userToken;
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', authorization);
        var aux = AppSettings.API_ENDPOINT + url;
        var message = {
                    "cardCover" : aux 
                }
        let body= JSON.stringify(message);
        return this.http.put(AppSettings.API_ENDPOINT_CONFIG,body, { headers: headers });
    }

}// END OF DataService