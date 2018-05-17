//MODULES
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import {AuthenticationService} from '../../services/authentication.service';
import { DataService } from '../../services/data.service';

//INTERFACES
import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';

//SETTINGS
import {AppSettings} from '../../AppSettings';

@Component({
  selector: 'app-update-collection',
  templateUrl: './update-collection.component.html',
  styleUrls: ['./update-collection.component.css']
})

export class UpdateCollectionComponent implements OnInit {

  selectedFile: File = null;
  selectedCards: Card[] = [];
  cards: Card[] = [];
  inputName: string = "";
  inputSearch: string = "";
  url: string = "";
  urlCard1: string = "";
  urlCard2: string = "";
  urlCard3: string = "";
  urlCard4: string = "";
  urlCard5: string = "";
  urlCard6: string = "";
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;
  collectionUpdating: Collection;
  selectedGamemode: number;

  //Alarm Conditions
  errorCollectionNotFull: boolean = false;
  errorNoInfo: boolean = false;
  collectionUpdated: boolean = false;
  prevImage: boolean = false;
  collectionFull: boolean = false;
  collectionEmpty: boolean = false;
  cardNotInCollection: boolean = false;
  sawCollection: boolean = false;
  cardRepeated: boolean = false;
  noCardsWithSpecificTag: boolean = false;
  noCards: boolean = false;

  @ViewChild('gamemodeInput') gamemodeInput: ElementRef;

  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private router:Router) { }

  ngOnInit() {
    this._authenticationService.isUserValidated();
    this.getCollectionForUpdate();
    this.getAllItems();
  }

  getCollectionForUpdate() {
    this.sawCollection = true;
    this._dataService.currentCollectionUpdating.subscribe(collectionUpdating => this.collectionUpdating = collectionUpdating);
    if (!this.collectionUpdating){
      this.router.navigate(["/collectionsCP"]);
    }else{
      this.inputName = this.collectionUpdating.name;
      this.selectedGamemode = this.collectionUpdating.gamemode;
      if (this.collectionUpdating.gamemode==0){
        this.gamemodeInput.nativeElement.value = "Arcade";
      }else if (this.collectionUpdating.gamemode==1){
        this.gamemodeInput.nativeElement.value = "Survival";
      }
      var aux: Card;
      var cardsCollection = this.collectionUpdating.cards.split(',');
      this._dataService.getItem(cardsCollection[0]).subscribe(data=>{
        aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
        this.urlCard1 = AppSettings.API_ENDPOINT + aux.fileURL;
        this.selectedCards.push(aux);
      });
      this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
        aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
        this.urlCard2 = AppSettings.API_ENDPOINT + aux.fileURL;
        this.selectedCards.push(aux);
      });
      this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
        aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
        this.urlCard3 = AppSettings.API_ENDPOINT + aux.fileURL;
        this.selectedCards.push(aux);
      });
      this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
        aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
        this.urlCard4 = AppSettings.API_ENDPOINT + aux.fileURL;
        this.selectedCards.push(aux);
      });
      this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
        aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
        this.urlCard5 = AppSettings.API_ENDPOINT + aux.fileURL;
        this.selectedCards.push(aux);
      });
      this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
        aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
        this.urlCard6 = AppSettings.API_ENDPOINT + aux.fileURL;
        this.selectedCards.push(aux);
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

  getAllItems(){
    this.clearData();
    this._dataService.getAllItems().subscribe(data=>{
      //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="0"){
          this.cards.push(data[i]);
        }   
      }
      this.noCardsWithSpecificTag = false;
      if (this.cards.length == 0){
        this.noCards = true;
      }else{
        this.noCards = false;
      }
    });
  }

  getSpecificItems(tag){
    this.clearData();
    var tagLowerCase= tag.toLowerCase();
    this._dataService.getAllItems().subscribe(data=>{
      //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="0"){
          var cleanTags = data[i].tags.replace(' ','');
          var cardTags = cleanTags.split(',');
          for(let j=0;(j<cardTags.length);j++){
            if(cardTags[j].toLowerCase()==tagLowerCase){
              this.cards.push(data[i]);
              break;
            }
          }
        }     
      }
      this.noCards = false;
      if (this.cards.length == 0){
        this.noCardsWithSpecificTag = true;
      }else{
        this.noCardsWithSpecificTag = false;
      }
    });
  }

  addCardtoCollection(id){
    if (this.selectedCards.length>=6){
      this.collectionFull= true;
      this.cardRepeated=false;
      this.collectionEmpty = false;
      this.cardRepeated=false;
    }else{
      this.collectionFull= false;
      this.collectionEmpty = false;
      this.cardRepeated=false;
      this.cardNotInCollection = false;
      var cortado=false;
      for(let i=0; i<this.selectedCards.length; i++){
          if(this.selectedCards[i]._id==this.cards[id]._id){
            this.cardRepeated=true;
            cortado=true;
            break;
          }
      }
      if(!cortado){
        this.cardRepeated=false;
        this.selectedCards.push(this.cards[id]);
        this.updateImages();
      }    
    }
  }

  deleteCardfromCollection(id){
    this.cardRepeated=false;
    if (this.selectedCards.length==0){
      this.collectionEmpty= true;
      this.collectionFull = false;
      this.cardNotInCollection = false;
    }else{
      this.collectionEmpty= false;
      this.collectionFull = false;
      this.cardNotInCollection = false;
      var deleted:boolean = false;
      for(let i=0;i<this.selectedCards.length;i++){
        if(this.selectedCards[i]._id == this.cards[id]._id){
          deleted = true;
          this.selectedCards.splice(i,1);
          this.updateImages(); 
          break;
        }
      }
      if (!deleted) {
        this.cardNotInCollection = true;
      } 
    }
  }

  setGamemode(gamemode){
    var aux = gamemode.toLowerCase();
    if (aux=="arcade"){
      this.selectedGamemode = 0;
    }else if (aux=="survival"){
      this.selectedGamemode = 1;
    } 
  }

  updateImages(){
    this.clearImagesURL();
    for(let i=0;i<this.selectedCards.length;i++){
      switch(i){
        case 0: 
              this.urlCard1 = AppSettings.API_ENDPOINT + this.selectedCards[i].fileURL;
              break;
        case 1: 
              this.urlCard2 = AppSettings.API_ENDPOINT + this.selectedCards[i].fileURL;
              break;
        case 2: 
              this.urlCard3 = AppSettings.API_ENDPOINT + this.selectedCards[i].fileURL;
              break;
        case 3: 
              this.urlCard4 = AppSettings.API_ENDPOINT + this.selectedCards[i].fileURL;
              break;
        case 4: 
              this.urlCard5 = AppSettings.API_ENDPOINT + this.selectedCards[i].fileURL;
              break;
        case 5: 
              this.urlCard6 = AppSettings.API_ENDPOINT + this.selectedCards[i].fileURL;
              break;
      }
    }
  }

  clearImagesURL(){
    this.urlCard1= "";
    this.urlCard2= "";
    this.urlCard3= "";
    this.urlCard4= "";
    this.urlCard5= "";
    this.urlCard6= "";
    if (this.selectedCards.length>=1){
      this.sawCollection = true;
    }
    else{
      this.sawCollection = false;
    }
  }

  updateCollection(){
    if (this.selectedCards.length==6){
      if(this.inputName!=""){
        var cardsID: string = "";
        for(let i=0;i<this.selectedCards.length;i++){
          if (i==0){
            cardsID = cardsID + this.selectedCards[i]._id;
          }else{
            cardsID = cardsID + ',' + this.selectedCards[i]._id;
          }
        }
        this.collectionUpdating.cards = cardsID;
        this.collectionUpdating.name = this.inputName;
        this.collectionUpdating.gamemode = this.selectedGamemode;
        this._dataService.updateCollection(this.collectionUpdating).subscribe(data=>{
          this.clearData();
          this.getAllItems();
          this.errorCollectionNotFull = false;
          this.errorNoInfo = false;
          this.prevImage = false;
          this.collectionUpdated = true;
        });
      }else{
        this.collectionUpdated = false;
        this.errorNoInfo = true;
        this.errorCollectionNotFull = false;
      }
    }else {
      this.collectionUpdated = false;
      this.errorCollectionNotFull = true;
      this.errorNoInfo = false;
    }
  }

  sawCard(id){
    this.url = AppSettings.API_ENDPOINT + this.cards[id].fileURL;
    this.nameDisplay = this.cards[id].name;
    this.historyDisplay = this.cards[id].history;
    this.tagsDisplay = this.cards[id].tags;
  }

  clearData(){
    this.cards = [];
  }

  doSpecificSearch(){
    if (this.inputSearch==""){
      this.getAllItems();
    }
    else{
      this.getSpecificItems(this.inputSearch);
    }
  }

}/// END OF COMPONENT UpdateCollectionComponent ///
