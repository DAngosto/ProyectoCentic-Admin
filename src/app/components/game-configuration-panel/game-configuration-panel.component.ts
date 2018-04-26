
import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { DataService } from '../../services/data.service';

import { Card } from '../../interfaces/Card';
import { Observable } from 'rxjs/observable';

import { ActivatedRoute, Router} from '@angular/router';
import { Collection } from '../../interfaces/Collection';

@Component({
  selector: 'app-game-configuration-panel',
  templateUrl: './game-configuration-panel.component.html',
  styleUrls: ['./game-configuration-panel.component.css']
})
export class GameConfigurationPanelComponent implements OnInit {

  itemsTable: Observable<Card[]>;

  collections: Collection[] = [];
  cards: Card[] = [];


  visualizeImage: boolean = false;
  collectionDeleted: boolean = false;
  noCollection: boolean = false;
  url: any;
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;

  collectiondisplaying: any;
  //itemsPrueba: Observ;

  urlCard1: string = "";
  urlCard2: string = "";
  urlCard3: string = "";
  urlCard4: string = "";
  urlCard5: string = "";
  urlCard6: string = "";
  nameDisplay1: string = "";
  nameDisplay2: string = "";
  nameDisplay3: string = "";
  nameDisplay4: string = "";
  nameDisplay5: string = "";
  nameDisplay6:string = "";

 


  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService,  private router:Router) { }

  ngOnInit() {
    this._authenticationService.isUserValidated();
    this.getAllCollections();

  }

  getAllCollections(){
      this.clearData();
      this._dataService.getAllItemsCollection().subscribe(data=>{
          //Solo guardamos para mostrar los que son del tipo 1 debido a que son las colecciones
          for(let i=0; i<data.length; i++){
              if (data[i].itemType=="1"){
                this.collections.push(data[i]);
              }  
          }

          if (this.collections.length == 0){
            this.noCollection = true;
          }else{
            this.noCollection = false;
          }
      });

      this._dataService.getAllItems().subscribe(data=>{
          //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
          for(let i=0; i<data.length; i++){
              if (data[i].itemType=="0"){
                this.cards.push(data[i]);
              }
          }
      });
      
  }

  
  sawCollection(id){

    this.collectiondisplaying = this.collections[id].name;
    var cardsCollection = this.collections[id].cards.split(',');
    this._dataService.getItem(cardsCollection[0]).subscribe(data=>{
      this.nameDisplay1 = data['name'];
      this.urlCard1 = 'https://gameserver.centic.ovh' + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
      this.nameDisplay2 = data['name'];
      this.urlCard2 = 'https://gameserver.centic.ovh' + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
      this.nameDisplay3 = data['name'];
      this.urlCard3 = 'https://gameserver.centic.ovh' + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
      this.nameDisplay4 = data['name'];
      this.urlCard4 = 'https://gameserver.centic.ovh' + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
      this.nameDisplay5 = data['name'];
      this.urlCard5 = 'https://gameserver.centic.ovh' + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
      this.nameDisplay6 = data['name'];
      this.urlCard6 = 'https://gameserver.centic.ovh' + data['fileURL'];
    });
  }
  

  
  changeStatus(id){

    if(this.collections[id].publish==false){
      var cardsCollection = this.collections[id].cards.split(',');
      this._dataService.getItem(cardsCollection[0]).subscribe(data=>{
          if(data['publish']==false){
            var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
            this._dataService.updateCard(aux);
          }
      });
      this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
        if(data['publish']==false){
          
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
        if(data['publish']==false){
          
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux);
        }
      });

      this.collections[id].publish=true;
      this._dataService.updateCollection(this.collections[id]).subscribe(data=>{
        this.clearData();
        this.getAllCollections();
      });
    }
    else{
      var cardsCollection = this.collections[id].cards.split(',');
      this._dataService.getItem(cardsCollection[0]).subscribe(data=>{
          if(data['publish']==true){
            var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
            this._dataService.updateCard(aux);
          }
      });
      this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
        if(data['publish']==false){
          
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
        if(data['publish']==false){
          
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
        }
      });
      this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
        }
      });

      this.collections[id].publish=false;
      this._dataService.updateCollection(this.collections[id]).subscribe(data=>{
        this.clearData();
        this.getAllCollections();
      });

    }
    
  }

  setCard(_id,name,history,tags,fileURL,itemType, publish) : Card{
    var cardAux: Card = {_id,name,history,tags,fileURL,itemType, publish};
    cardAux._id = _id;
    cardAux.name = name;
    cardAux.history = history;
    cardAux.tags = tags;
    cardAux.fileURL = fileURL;
    cardAux.itemType = itemType;
    cardAux.publish = publish;
    return cardAux;
  }

  /*
  setCollection(_id,name,cards,itemType, publish) : Collection{

    
    var collectionAux: Collection = {_id,name,cards,itemType, publish};
    collectionAux._id = _id;
    collectionAux.name = name;
    collectionAux.cards = cards;
    collectionAux.itemType = itemType;
    collectionAux.publish = publish;
    return collectionAux;
  }
  */
  

 

  clearData(){
    this.collections = [];
  }

}



