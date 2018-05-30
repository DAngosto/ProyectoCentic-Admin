//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


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
  prevImage: boolean = false;
  sawCollection: boolean = false;


  

  constructor(private _dataService: DataService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {
    this.getAllItems();
  }

  showToast(type, message){
    switch(type){
      case 0:
            this.toastr.error(message);
            break;
      case 1:
            this.toastr.success(message);
            break;
      case 2:
            this.toastr.info(message);
            break;
      case 3:
            this.toastr.warning(message);
            break;
    }
  }

  getAllItems(){
    this.clearData();
    this._dataService.getAllItems().subscribe(data=>{
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="0"){
          this.cards.push(data[i]);
        }    
      }
      if (this.cards.length == 0){
        this.showToast(2,"No hay cartas creadas actualmente");
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
      if (this.cards.length == 0){
        this.showToast(2,"No hay cartas creadas actualmente con la etiqueta especificada");
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
    if (this.selectedCards.length>=6){
      this.showToast(2,"La colección ya posee 6 cartas, si deseas añadir otra carta más procede primero a eliminar una de las ya introducidas");
    }else{
      var cortado=false;
      for(let i=0; i<this.selectedCards.length; i++){
        if(this.selectedCards[i]._id==this.cards[id]._id){
          this.showToast(2,"La carta que está intentando añadir ya se encuentra en la colección. Está prohibido introducir dos cartas iguales en una misma colección");
          cortado=true;
          break;
        }
      }
      if(!cortado){
        this.selectedCards.push(this.cards[id]);
        this.updateImages();
      }
    }
  }

  deleteCardfromCollection(id){
    if (this.selectedCards.length==0){
      this.showToast(2,"La colección está vacía actualmente. Por favor añade cartas a la colección antes de intentar quitar una");
    }else{
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
        this.showToast(0,"La carta que está intentando quitar no se encuentra almacenada en la colección");
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
          this.prevImage = false;
          this.showToast(1,"La colección ha sido creada correctamente");
          this.inputName = "";
          this.sawCollection=false;
        });
      }else{
        this.showToast(0,"Campo nombre incompleto, por favor introduzca la información correspondiente");
      }
    }else {
      this.showToast(0,"La colección a crear no posee 6 cartas, por favor seleccionalas antes de intentar crear una colección");
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
