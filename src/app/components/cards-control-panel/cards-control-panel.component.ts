//MODULES
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { DataService } from '../../services/data.service';

//INTERFACES
import { Card } from '../../interfaces/Card';

//SETTINGS
import {AppSettings} from '../../AppSettings';

@Component({
  selector: 'app-cards-control-panel',
  templateUrl: './cards-control-panel.component.html',
  styleUrls: ['./cards-control-panel.component.css']
})

export class CardsControlPanelComponent implements OnInit {

  itemsTable: Observable<Card[]>;
  items: Card[] = [];

  inputSearch: string = "";
  url: any;
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;

  //Alarm Conditions
  visualizeImage: boolean = false;
  cardDeleted: boolean = false;
  noCards: boolean = false;
  dependenceExists: boolean = false;
  noCardsWithSpecificTag: boolean = false;

  constructor(private _dataService: DataService,  private router:Router) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems(){
    this.clearData();
    this._dataService.getAllItems().subscribe(data=>{
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="0"){
          this.items.push(data[i]);
        }
      }
      this.noCardsWithSpecificTag = false;
      if (this.items.length == 0){
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
              this.items.push(data[i]);
              break;
            }
          }
        }   
      }
      this.noCards = false;
      if (this.items.length == 0){
        this.noCardsWithSpecificTag = true;
      }else{
        this.noCardsWithSpecificTag = false;
      }
    });
  }

  /*
  EN:Function in charge of introducing the card information in the modal window.
  ES:Función encargada de introducir la información de la carta en la ventana modal.
  */
  sawCard(id){
    this.cardDeleted = false;
    this.url = AppSettings.API_ENDPOINT + this.items[id].fileURL;
    this.nameDisplay = this.items[id].name;
    this.historyDisplay = this.items[id].history;
    this.tagsDisplay = this.items[id].tags;
    this.visualizeImage = true;
  }

  updateCard(id){
    this._dataService.changeCard(this.items[id]);
    this.router.navigate(["/updateCard"]);
  }

  deleteCard(id){
    this.cardDeleted = false;
    this.cardInACollection(this.items[id]._id);
  }

  clearData(){
    this.items = [];
  }

  /*
  EN:Function in charge of going through the collections to find out if any of them depend on this card, in case there is any 
    dependency we cut the search loops and notify that it cannot be deleted. Otherwise, the card is removed.
  ES:Función encargada de recorrer las colecciones para averiguar si alguna depende de esta carta, en el caso de que exista alguna 
    dependencia cortamos los bucles de búsqueda y notificamos que no puede ser eliminada. En el caso contrario se elimina la carta.
  */
  cardInACollection(idCardSearching){
    var NotFreeOfDependencies = false;
    this.dependenceExists = false;
    this._dataService.getAllItemsCollection().subscribe(data=>{
      for(let i=0; (i<data.length); i++){
        if (data[i].itemType=="1"){
          var cardsCollection = data[i].cards.split(',');
          for(let j=0;(j<cardsCollection.length);j++){
            if(cardsCollection[j]==idCardSearching){
              NotFreeOfDependencies = true;
              this.dependenceExists = true;
              break;
            }
          }
        } 
        if(NotFreeOfDependencies) break; 
      }
      if(!NotFreeOfDependencies){
        this._dataService.deleteItem(idCardSearching).subscribe(data=>{
          this.clearData();
          this.cardDeleted = true;
          this.getAllItems();
        });
      }
    });
  }

  doSpecificSearch(){
    if (this.inputSearch==""){
      this.getAllItems();
    }
    else{
      this.getSpecificItems(this.inputSearch);
    }
  }


}/// END OF COMPONENT CardsControlPanelComponent ///



