//MODULES
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//SERVICES
import { DataService } from '../../services/data.service';

//INTERFACES
import { Card } from '../../interfaces/Card';

//SETTINGS
import {AppSettings} from '../../AppSettings';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})

export class CreateCollectionComponent implements OnInit {

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
  selectedGamemode: number = 0;

  //Alarm Conditions
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
  noCards: boolean = false;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems(){
    this.clearData();
    this._dataService.getAllItems().subscribe(data=>{
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
    this.url = AppSettings.API_ENDPOINT + this.cards[id].fileURL;
    this.nameDisplay = this.cards[id].name;
    this.historyDisplay = this.cards[id].history;
    this.tagsDisplay = this.cards[id].tags;
  }

  addCardtoCollection(id){
    this.collectionUploaded=false;
    if (this.selectedCards.length>=6){
      this.collectionFull= true;
      this.cardRepeated=false;
      this.collectionEmpty = false;
    }else{
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
    }
  }

  deleteCardfromCollection(id){
    this.cardRepeated=false;
    if (this.selectedCards.length==0){
      this.collectionEmpty= true;
      this.collectionFull = false;
    }else{
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

  /*
  EN:Function in charge of refreshing the images of the selected cards.
  ES:Función encargada de refrescar las imagenes de las cartas seleccionadas.
  */
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

  uploadCollection(){
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
        this._dataService.uploadCollection(this.inputName,this.selectedGamemode,cardsID).subscribe(data=>{
          this.clearImagesURL();
          this.clearData();    
          this.selectedCards = [];
          this.getAllItems();
          this.collectionFull = false;
          this.errorCollectionNotFull = false;
          this.errorNoInfo = false;
          this.prevImage = false;
          this.collectionUploaded = true;
          this.inputName = "";
          this.prevImage = false;
          this.sawCollection=false;
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

}/// END OF COMPONENT CreateCollectionComponent ///
