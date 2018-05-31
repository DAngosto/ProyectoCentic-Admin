//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
  visualizeImage: boolean = false;

  constructor(private _dataService: DataService,  private router:Router, public toastr: ToastsManager, vcr: ViewContainerRef) {
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
          this.items.push(data[i]);
        }
      }
      if (this.items.length == 0){
        this.showToast(2,"No hay cartas creadas");
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
              this.items.push(data[i]);
              break;
            }
          }
        }   
      }
      if (this.items.length == 0){
        this.showToast(2,"No hay cartas creadas con la etiqueta especificada");
      }
    });
  }

  /*
  EN:Function in charge of introducing the card information in the modal window.
  ES:Función encargada de introducir la información de la carta en la ventana modal.
  */
  sawCard(id){
    this.url = AppSettings.API_ENDPOINT + this.items[id].fileURL;
    this.nameDisplay = this.items[id].name;
    this.historyDisplay = this.items[id].history;
    this.tagsDisplay = this.items[id].tags;
    this.visualizeImage = true;
  }

  /*
  EN:Function in charge of passing the data of the card to be updated to the service and performing the redirection.
  ES:Función encargada de pasar los datos de la carta a actualizar al servicio y realizar la redirección.
  */
  updateCard(id){
    this._dataService.changeCard(this.items[id]);
    this.router.navigate(["/updateCard"]);
  }

  /*
  EN:Function in charge of making the call for the deletion of a letter.
  ES:Función encargada de realizar la llamada para la eliminación de una carta.
  */
  deleteCard(id){
    this.cardInACollection(this.items[id]._id);
  }

  /*
  EN:Function in charge of emptying the items stored in the component.
  ES:Función encargada de vaciar los items almacenados en el componente.
  */
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
    this._dataService.getAllItemsCollection().subscribe(data=>{
      for(let i=0; (i<data.length); i++){
        if (data[i].itemType=="1"){
          var cardsCollection = data[i].cards.split(',');
          for(let j=0;(j<cardsCollection.length);j++){
            if(cardsCollection[j]==idCardSearching){
              NotFreeOfDependencies = true;
              this.showToast(3,"La carta que está intentando eliminar pertenece a una o más colecciones. Elimine primero la/las coleccion/es y después proceda a eliminar la carta");
              break;
            }
          }
        } 
        if(NotFreeOfDependencies) break; 
      }
      if(!NotFreeOfDependencies){
        this._dataService.deleteItem(idCardSearching).subscribe(data=>{
          this.clearData();
          this.showToast(1,"La carta ha sido eliminada correctamente");
          this.getAllItems();
        });
      }
    });
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


}/// END OF COMPONENT CardsControlPanelComponent ///



