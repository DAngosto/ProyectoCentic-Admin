import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { DataService } from '../../services/data.service';
import {AuthenticationService} from '../../services/authentication.service';

import { Card } from '../../interfaces/Card';


@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})
export class CreateCollectionComponent implements OnInit {

  selectedFile: File = null;
  errorCollectionNotFull: boolean = false;
  errorNoInfo: boolean = false;
  collectionUploaded: boolean = false;
  prevImage: boolean = false;
  collectionFull: boolean = false;
  collectionEmpty: boolean = false;
  cardNotInCollection: boolean = false;
  sawCollection: boolean = false;
  cardRepeated: boolean = false;
  noCardsWithSpecificTag: boolean = false;

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


  cards: Card[] = [];
  noCards: boolean = false;
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;

  selectedGamemode: number = 0;

  





  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService) { }

  ngOnInit() {

    this._authenticationService.isUserValidated();
    this.getAllItems();
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

sawCard(id){
  this.url = 'https://gameserver.centic.ovh' + this.cards[id].fileURL;
  this.nameDisplay = this.cards[id].name;
  this.historyDisplay = this.cards[id].history;
  this.tagsDisplay = this.cards[id].tags;
}

  addCardtoCollection(id){
    if (this.selectedCards.length>=6){
      this.collectionFull= true;
      this.cardRepeated=false;
      this.collectionEmpty = false;
    }
    else{
      this.collectionFull= false;
      this.collectionEmpty = false;
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
      

      /*
      if (this.selectedCards.includes(this.cards[id])){
          this.cardRepeated=true;
      }
      else{
        
        this.selectedCards.push(this.cards[id]);
        this.updateImages();
      }
      */
      
      
      
    }
  }

  deleteCardfromCollection(id){
    this.cardRepeated=false;
    if (this.selectedCards.length==0){
      this.collectionEmpty= true;
      this.collectionFull = false;
    }
    else{
      this.collectionEmpty= false;
      this.collectionFull = false;
      this.cardNotInCollection = false;
      var cortado=false;
      for(let i=0; i<this.selectedCards.length; i++){
        if(this.selectedCards[i]._id==this.cards[id]._id){
          this.selectedCards.splice(i,1);
          this.updateImages();
          cortado=true;
          break;
        }
      }
      if(!cortado){
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

  uploadCollection(){

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
          this._dataService.uploadCollection(this.inputName,this.selectedGamemode,cardsID).subscribe(data=>{
              this.clearImagesURL();
              this.clearData();
              this.getAllItems();
              this.collectionFull = false;
              this.errorCollectionNotFull = false;
              this.errorNoInfo = false;
              this.prevImage = false;
              this.collectionUploaded = true;
              this.inputName = "";
              this.prevImage = false;
          });
        }else{
          this.collectionUploaded = false;
          this.errorNoInfo = true;
          this.errorCollectionNotFull = false;
         }
    }else {
      this.collectionUploaded = false;
      this.errorCollectionNotFull = true;
      this.errorNoInfo = false;
    }
  }

  clearData(){
    this.cards = [];
    this.selectedCards = [];
  }

  doSpecificSearch(){
    if (this.inputSearch==""){
      this.getAllItems();
    }
    else{
      this.getSpecificItems(this.inputSearch);
    }
  }


  setGamemode(gamemode){
    
    var aux = gamemode.toLowerCase();
    if (aux=="arcade"){
      this.selectedGamemode = 0;
    } 
    else if (aux=="survival"){
      this.selectedGamemode = 1;
    } 

  }

}
