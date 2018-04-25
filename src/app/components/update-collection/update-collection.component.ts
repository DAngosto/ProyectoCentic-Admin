import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';
import { DataService } from '../../services/data.service';
import { CardsControlPanelComponent } from '../cards-control-panel/cards-control-panel.component';

import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-update-collection',
  templateUrl: './update-collection.component.html',
  styleUrls: ['./update-collection.component.css']
})

export class UpdateCollectionComponent implements OnInit {

  selectedFile: File = null;
  errorCollectionNotFull: boolean = false;
  errorNoInfo: boolean = false;
  collectionUpdated: boolean = false;
  prevImage: boolean = false;
  collectionFull: boolean = false;
  collectionEmpty: boolean = false;
  cardNotInCollection: boolean = false;
  sawCollection: boolean = false;
  cardRepeated: boolean = false;

  inputName: string = "";
  inputSearch: string = "";


  url: string = "";

  urlCard1: string = "";
  urlCard2: string = "";
  urlCard3: string = "";
  urlCard4: string = "";
  urlCard5: string = "";
  urlCard6: string = "";
  selectedCards: Card[] = [];
  noCardsWithSpecificTag: boolean = false;


  cards: Card[] = [];
  noCards: boolean = false;
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;

  collectionUpdating: Collection;




  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private router:Router) { }

  ngOnInit() {

    this._authenticationService.isUserValidated();
    this.getCollectionForUpdate();
    this.getAllItems();
  }

  getCollectionForUpdate() {
    //this._cardsService.changeCard("Hello from Sibling")
    this.sawCollection = true;
    this._dataService.currentCollectionUpdating.subscribe(collectionUpdating => this.collectionUpdating = collectionUpdating);

    if(!this.collectionUpdating){
      this.router.navigate(["/collectionsCP"]);
    }
    else{
      this.inputName = this.collectionUpdating.name;
    var aux: Card;
    
    var cardsCollection = this.collectionUpdating.cards.split(',');
    this._dataService.getItem(cardsCollection[0]).subscribe(data=>{
      aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
      this.urlCard1 = 'https://gameserver.centic.ovh' + aux.fileURL;
      this.selectedCards.push(aux);
    });
    
    this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
      aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
      this.urlCard2 = 'https://gameserver.centic.ovh' + aux.fileURL;
      this.selectedCards.push(aux);
    });
    this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
      aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
      this.urlCard3 = 'https://gameserver.centic.ovh' + aux.fileURL;
      this.selectedCards.push(aux);
    });
    this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
      aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
      this.urlCard4 = 'https://gameserver.centic.ovh' + aux.fileURL;
      this.selectedCards.push(aux);
    });
    this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
      aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
      this.urlCard5 = 'https://gameserver.centic.ovh' + aux.fileURL;
      this.selectedCards.push(aux);
    });
    this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
      aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],data['publish']);
      this.urlCard6 = 'https://gameserver.centic.ovh' + aux.fileURL;
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

    }
    else{
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
    }
    else{
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


  updateImages(){
    this.clearImagesURL();
    for(let i=0;i<this.selectedCards.length;i++){
      switch(i){
        case 0: 
              this.urlCard1 = 'https://gameserver.centic.ovh' + this.selectedCards[i].fileURL;
              break;
        case 1: 
              this.urlCard2 = 'https://gameserver.centic.ovh' + this.selectedCards[i].fileURL;
              break;
        case 2: 
              this.urlCard3 = 'https://gameserver.centic.ovh' + this.selectedCards[i].fileURL;
              break;
        case 3: 
              this.urlCard4 = 'https://gameserver.centic.ovh' + this.selectedCards[i].fileURL;
              break;
        case 4: 
              this.urlCard5 = 'https://gameserver.centic.ovh' + this.selectedCards[i].fileURL;
              break;
        case 5: 
              this.urlCard6 = 'https://gameserver.centic.ovh' + this.selectedCards[i].fileURL;
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
    console.log(this.selectedCards.length);
    if (this.selectedCards.length==6){
      
         if(this.inputName!=""){
          var cardsID: string = "";
          for(let i=0;i<this.selectedCards.length;i++){
            if (i==0){
              cardsID = cardsID + this.selectedCards[i]._id;
            }
            else{
              cardsID = cardsID + ',' + this.selectedCards[i]._id;
            }
          }

          this.collectionUpdating.cards = cardsID;
          this.collectionUpdating.name = this.inputName;



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

}
