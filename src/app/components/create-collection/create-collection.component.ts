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

  /*
  EN:Function in charge of displaying a Toast message on the screen.
  ES:Función encargada de mostrar un mensaje Toast en la pantalla.
  */
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

  /*
  EN:Function in charge of getting all the existing cards.
  ES:Función encargada de obtener todas las cartas existentes.
  */
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
      for(let i=0; i<this.cards.length; i++){
        this.cards[i].fileURL = AppSettings.API_ENDPOINT + this.cards[i].fileURL;
      }
    });
  }

  /*
  EN:Function in charge of performing a specific search obtaining those cards that have the tag entered.
  ES:Función encargada de realizar una búsqueda específica obteniendo aquellas cartas que tengan la etiqueta introducida.
  */
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

  /*
  EN:Function in charge of inserting the card information in the modal window.
  ES:Función encargada de introducir la información de la carta en la ventana modal.
  */
  sawCard(id){
    this.url = this.cards[id].fileURL;
    this.nameDisplay = this.cards[id].name;
    this.historyDisplay = this.cards[id].history;
    this.tagsDisplay = this.cards[id].tags;
  }

  /*
  EN:Function in charge of inserting the selected card into the future collection to be created.
  ES:Función encargada de introducir la carta seleccionada a la futura colección a ser creada.
  */
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
        this.showToast(1,"Carta añadida a la colección");
        this.updateImages();
      }
    }
  }

  /*
  EN:Function in charge of removing the selected card from the future collection to be created.
  ES:Función encargada de eliminar la carta seleccionada en la futura colección a ser creada.
  */
  deleteCardfromCollection(id){
    if (this.selectedCards.length==0){
      this.showToast(2,"La colección está vacía actualmente. Por favor añade cartas a la colección antes de intentar quitar una");
    }else{
      var cortado=false;
      for(let i=0; i<this.selectedCards.length; i++){
        if(this.selectedCards[i]._id==this.cards[id]._id){
          this.selectedCards.splice(i,1);
          this.showToast(1,"Carta eliminada de la colección");
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
  ES:Función encargada de refrescar las imágenes de las cartas seleccionadas.
  */
  updateImages(){
    this.clearImagesURL();
    for(let i=0;i<this.selectedCards.length;i++){
      switch(i){
        case 0: 
              this.urlCard1 = this.selectedCards[i].fileURL;
              break;
        case 1: 
              this.urlCard2 = this.selectedCards[i].fileURL;
              break;
        case 2: 
              this.urlCard3 = this.selectedCards[i].fileURL;
              break;
        case 3: 
              this.urlCard4 = this.selectedCards[i].fileURL;
              break;
        case 4: 
              this.urlCard5 = this.selectedCards[i].fileURL;
              break;
        case 5: 
              this.urlCard6 = this.selectedCards[i].fileURL;
              break;
      }
    }
  }

  /*
  EN:Function in charge of deleting the displayed images of the selected cards in the collection to be created.
  ES:Función encargada de eliminar las imágenes mostradas de las cartas seleccionadas en la colección a crear.
  */
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

  /*
  EN:Function in charge of creating the new collection in the API.
  ES:Función encargada de realizar la creación de la nueva colección en la API.
  */
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

  /*
  EN:Function in charge of emptying the items stored in the component.
  ES:Función encargada de vaciar los items almacenados en el componente.
  */
  clearData(){
    this.cards = [];
  }

  /*
  EN:Function in charge of performing a specific search or displaying all existing cards.
  ES:Función encargada de realizar una búsqueda específica o mostrar todas las cartas existentes.
  */
  doSpecificSearch(){
    if (this.inputSearch==""){
      this.getAllItems();
    }
    else{
      this.getSpecificItems(this.inputSearch);
    }
  }

  /*
  EN:Function in charge of storing the game mode of the collection to be created.
  ES:Función encargada de almacenar el modo de juego de la colección a ser creada.
  */
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
