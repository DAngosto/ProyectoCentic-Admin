//MODULES
import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//SERVICES
import { DataService } from '../../services/data.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';

//INTERFACES
import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';

//SETTINGS
import {AppSettings} from '../../AppSettings';

@Component({
  selector: 'app-game-configuration-panel',
  templateUrl: './game-configuration-panel.component.html',
  styleUrls: ['./game-configuration-panel.component.css']
})

export class GameConfigurationPanelComponent implements OnInit {

  itemsTable: Observable<Card[]>;
  collections: Collection[] = [];
  cards: Card[] = [];
  selectedFile: File = null;
  url: any;
  urlMostrar: any;
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
  inputSuccessPoints: number;
  inputFailPoints: number;
  inputLives: number;
  selectedGamemode: number = 0;


  @ViewChild('livesInput') livesInput: ElementRef;
  @ViewChild('successPointsInput') successPointsInput: ElementRef;
  @ViewChild('failPointsInput') failPointsInput: ElementRef;

  constructor(private _dataService: DataService,  private router:Router, private ng2ImgToolsService: Ng2ImgToolsService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {
    this.getCardCover();
    this.getAllCollections();
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
  EN:Function in charge of obtaining all the existing collections.
  ES:Función encargada de obtener todas las colecciones existentes.
  */
  getAllCollections(){
    this.clearData();
    this._dataService.getAllItemsCollection().subscribe(data=>{
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="1"){
          this.collections.push(data[i]);
        }  
      }
      if (this.collections.length == 0){
        this.showToast(2, "No hay colecciones creadas");
      }
    });
    this._dataService.getAllItems().subscribe(data=>{
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="0"){
          this.cards.push(data[i]);
        }
      }
    }); 
  }
  
  /*
  EN:Function in charge of inserting the information of a collection in the modal window.
  ES:Función encargada de introducir la información de una colección en la ventana modal.
  */
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
  
  /*
  EN:Function in charge of changing the game mode of a collection.
  ES:Función encargada de cambiar el modo de juego de una colección.
  */
  changeGamemode(id){
    if(this.collections[id].gamemode == 0){
      this.collections[id].gamemode = 1;
      this._dataService.updateCollection(this.collections[id]).subscribe(data=>{
        this.clearData();
        this.getAllCollections();
      });
    }
    else if (this.collections[id].gamemode == 1){
      this.collections[id].gamemode = 0;
      this._dataService.updateCollection(this.collections[id]).subscribe(data=>{        
        this.clearData();
        this.getAllCollections();
      });
    }
    this.showToast(1,"Modo de juego actualizado"); 
  }

  /*
  EN:Function in charge of being able to change its respective configuration according to the selected game mode.
  ES:Función encargada de, según el modo de juego seleccionado, poder cambiar su respectiva configuración.
  */
  setGamemode(gamemode){
    var aux = gamemode.toLowerCase();
    if (aux=="arcade"){
      this.selectedGamemode = 0;
      this.livesInput.nativeElement.value = null;
      this.livesInput.nativeElement.disabled = true;
      this.successPointsInput.nativeElement.disabled = false;
      this.failPointsInput.nativeElement.disabled = false;
    } 
    else if (aux=="survival"){
      this.selectedGamemode = 1;
      this.livesInput.nativeElement.disabled = false;
      this.successPointsInput.nativeElement.disabled = true;
      this.failPointsInput.nativeElement.disabled = true;
      this.successPointsInput.nativeElement.value = null;
      this.failPointsInput.nativeElement.value = null;
    } 
  }

  /*
  EN:Function in charge of updating the configuration of the selected game mode.
  ES:Función encargada de actualizar la configuración del modo de juego seleccionado.
  */
  updateGamemode(){
    if ((!this.inputSuccessPoints) && (!this.inputFailPoints)&&(!this.livesInput.nativeElement.value)){
      this.showToast(0,"Por favor selecciona un número de puntos por acierto/fallo o de vidas antes de actualizar un modo de juego");
    }else{
      if(this.selectedGamemode==0){
        if (this.inputSuccessPoints){
          this._dataService.updateConfigPoints(this.selectedGamemode, 0, this.inputSuccessPoints).subscribe(data=>{
          });
        }
        if (this.inputFailPoints){
          this._dataService.updateConfigPoints(this.selectedGamemode, 1, this.inputFailPoints).subscribe(data=>{
          });
        }
        this.showToast(1,"La configuración del juego ha sido actualizada");
      }
      else if(this.selectedGamemode==1){
        if(this.livesInput.nativeElement.value){
          this._dataService.updateConfigPoints(this.selectedGamemode, 2, this.inputLives).subscribe(data=>{
            this.showToast(1,"La configuración del juego ha sido actualizada");
          });
        }
      }
    }
  }

  /*
  EN:Function in charge of storing the selected image to be the corresponding one on the back of the cards during the game.
  ES:Función encargada de almacenar la imagen seleccionada para ser la correspondiente del dorso de las cartas durante el juego.
  */
  onFileSelected(event){
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = <File> event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.url = reader.result; 
    }
  }

  /*
  EN:Function in charge of getting the current back of the cards.
  ES:Función encargada de obtener el dorso actual de las cartas.
  */
  getCardCover(){
    this._dataService.getConfig().subscribe(data=>{
      this.urlMostrar = data['cardCover'];
    });
  }

  /*
  EN:Function in charge of updating the back of the cards during the game.
  ES:Función encargada de actualizar el dorso de las cartas durante el juego.
  */
  updateCardCover(){
    if (this.selectedFile){
      const fd = new FormData();
      this.ng2ImgToolsService.resizeExactCrop([this.selectedFile], 258, 183).subscribe(result => {
        fd.append('file', result, this.selectedFile.name);
        this._dataService.uploadFile(fd).subscribe(data=>{
          let fileURL = data['file'];
          this._dataService.updateConfigCardCover(fileURL).subscribe(data=>{
            this.urlMostrar = AppSettings.API_ENDPOINT + fileURL;
            this.url = "";
            this.showToast(1,"El dorso de las cartas ha cambiado");
          });
      })
      }, error => {
        this.showToast(0,error);
      });
    }else{
      this.showToast(0,"Selecciona una imagen antes de intentar cambiar el dorso de las cartas");
    }      
  }

  /*
  EN:Function in charge of copy the ID of the desired collection to the clipboard.
  ES:Función encargada de copiar en el portapapeles el id de la colección deseada.
  */
  copyLink(id) {
    var text = this.collections[id]._id;
    var event = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
        document.removeEventListener('copy', event);
    }
    document.addEventListener('copy', event);
    document.execCommand('copy');
    this.showToast(1,"Id seleccionado copiado al portapapeles");
  }
  
  /*
  EN:Function in charge of changing the publish status of a collection. If a letter belongs to another published collection, its status will remain intact.
     Otherwise its status will become false.
  ES:Función encargada de cambiar el estado publish de una colección.En el caso de que una carta pertenezca a otra colección publicada, su estado permanecerá intacto.
     En otro caso su estado pasará a ser false.
  */
  changeStatus(id){
    var cardsCollection;
    if(this.collections[id].publish==false){
      cardsCollection = this.collections[id].cards.split(',');
      this._dataService.getItem(cardsCollection[0]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        }
      });
      this._dataService.getItem(cardsCollection[1]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        }
      });
      this._dataService.getItem(cardsCollection[2]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        }
      });
      this._dataService.getItem(cardsCollection[3]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        }
      });
      this._dataService.getItem(cardsCollection[4]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        }
      });
      this._dataService.getItem(cardsCollection[5]).subscribe(data=>{
        if(data['publish']==false){
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],true);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        }
      });
      this.collections[id].publish=true;
      this._dataService.updateCollection(this.collections[id]).subscribe(data=>{
        this.clearData();
        this.getAllCollections();
      });
    }else{
      this.collections[id].publish = false;
      var cardsCheck = this.collections[id].cards.split(',');
      var check0:boolean = false;
      var check1:boolean = false;
      var check2:boolean = false;
      var check3:boolean = false;
      var check4:boolean = false;
      var check5:boolean = false;
      for(let i=0;i<this.collections.length;i++){ 
        if(this.collections[i].publish==true){    
          cardsCollection = this.collections[i].cards.split(',');
          for(let j=0;j<=cardsCollection.length;j++){   
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
      if (!check0){
        this._dataService.getItem(cardsCheck[0]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        });
      }
      if (!check1){
        this._dataService.getItem(cardsCheck[1]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        });
      }
      if (!check2){
        this._dataService.getItem(cardsCheck[2]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        });
      }
      if (!check3){
        this._dataService.getItem(cardsCheck[3]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        });
      }
      if (!check4){
        this._dataService.getItem(cardsCheck[4]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        });
      }
      if (!check5){
        this._dataService.getItem(cardsCheck[5]).subscribe(data=>{
          var aux = this.setCard(data['_id'],data['name'],data['history'],data['tags'],data['fileURL'],data['itemType'],false);
          this._dataService.updateCard(aux).subscribe(data=>{
          });
        });
      }
      this.collections[id].publish=false;
      this._dataService.updateCollection(this.collections[id]).subscribe(data=>{
        this.clearData();
        this.getAllCollections();
      });
    }
    this.showToast(1,"El estado de la colección ha sido actualizado");
  }

  /*
  EN:Function in charge of creating a Card object with the data provided.
  ES:Función encargada de crear un objeto Carta con los datos proporcionados.
  */
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
  EN:Function in charge of emptying the items stored in the component.
  ES:Función encargada de vaciar los items almacenados en el componente.
  */
  clearData(){
    this.collections = [];
  }

}/// END OF COMPONENT GameConfigurationPanelComponent ///



