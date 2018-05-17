//MODULES
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { AuthenticationService } from '../../services/authentication.service';
import { DataService } from '../../services/data.service';

//INTERFACES
import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';

//SETTINGS
import {AppSettings} from '../../AppSettings';

@Component({
  selector: 'app-collections-control-panel',
  templateUrl: './collections-control-panel.component.html',
  styleUrls: ['./collections-control-panel.component.css']
})

export class CollectionsControlPanelComponent implements OnInit {

  itemsTable: Observable<Card[]>;
  collections: Collection[] = [];
  cards: Card[] = [];

  url: any;
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;
  collectiondisplaying: any;
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

  //Alarm Conditions
  visualizeImage: boolean = false;
  collectionDeleted: boolean = false;
  noCollection: boolean = false;

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
      this.urlCard1 = AppSettings.API_ENDPOINT + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
      this.nameDisplay2 = data['name'];
      this.urlCard2 = AppSettings.API_ENDPOINT + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
      this.nameDisplay3 = data['name'];
      this.urlCard3 = AppSettings.API_ENDPOINT + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
      this.nameDisplay4 = data['name'];
      this.urlCard4 = AppSettings.API_ENDPOINT + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
      this.nameDisplay5 = data['name'];
      this.urlCard5 = AppSettings.API_ENDPOINT + data['fileURL'];
    });
    this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
      this.nameDisplay6 = data['name'];
      this.urlCard6 = AppSettings.API_ENDPOINT + data['fileURL'];
    });
  }

  
  updateCollection(id){
    this._dataService.changeCollection(this.collections[id]);
    this.router.navigate(["/updateCollection"]);
  }
  

  deleteCollection(id){
    this.collectionDeleted = false;
    this.collections[id].publish = false;
    var cardsCheck = this.collections[id].cards.split(',');  //Las cartas de la coleccion que deseo borrar y tengo que comprobar si en el caso de que no haya otra coleccion activa con esa carta la ponga a false
    var cardsCollection;
    var check0:boolean = false;
    var check1:boolean = false;
    var check2:boolean = false;
    var check3:boolean = false;
    var check4:boolean = false;
    var check5:boolean = false;
    for(let i=0;i<this.collections.length;i++){  //Recorre todas las coleeciones
      if(this.collections[i].publish==true){    //Entro si esta en publish true
        cardsCollection = this.collections[i].cards.split(',');
        for(let j=0;j<=cardsCollection.length;j++){   //para cada carta de la coleccion publish=true encontrada compruebo si es una de las que estoy buscando, si es asi pongo su check a true para luego saber que esa carta debe permanecer en true y no modificarla
          if (cardsCollection[j]==cardsCheck[0]){
            check0=true;
          }else if (cardsCollection[j]==cardsCheck[1]){
            check1=true;
          }else if (cardsCollection[j]==cardsCheck[2]){
            check2=true;
          }else if (cardsCollection[j]==cardsCheck[3]){
            check3=true;
          }else if (cardsCollection[j]==cardsCheck[4]){
            check4=true;
          }else if (cardsCollection[j]==cardsCheck[5]){
            check5=true;
          }
        }
      }
    }
    //En el caso de que un check siga a falso es que no hay mas colecciones a true que tengan dicha carta, por lo tanto ponemos dicha carta en publish=false;
    if (!check0){
      this._dataService.getItem(cardsCheck[0]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
      });
    }
    if (!check1){
      this._dataService.getItem(cardsCheck[1]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
      });
    }
    if (!check2){
      this._dataService.getItem(cardsCheck[2]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
      });
    }
    if (!check3){
      this._dataService.getItem(cardsCheck[3]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
      });
    }
    if (!check4){
      this._dataService.getItem(cardsCheck[4]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
      });
    }
    if (!check5){
      this._dataService.getItem(cardsCheck[5]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux);
      });
    }

    //Procedemos a borrar la coleecion
    this._dataService.deleteItem(this.collections[id]._id).subscribe(data=>{
      this.clearData();
      this.collectionDeleted = true;
      this.getAllCollections();
    });
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

  clearData(){
    this.collections = [];
  }

}/// END OF COMPONENT CollectionsControlPanelComponent ///



