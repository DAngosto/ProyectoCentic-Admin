//MODULES
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { AuthenticationService } from '../../services/authentication.service';
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

  //Alarm Conditions
  visualizeImage: boolean = false;
  collectionDeleted: boolean = false;
  noCollection: boolean = false;
  collectionStatusUpdated: boolean = false;
  urlCopied: boolean = false;
  configUpdated: boolean = false;
  noValuePointsInput: boolean = false;
  cardCoverUpdated: boolean = false;
  errorNoImageSelected:boolean=false;

  @ViewChild('livesInput') livesInput: ElementRef;
  @ViewChild('successPointsInput') successPointsInput: ElementRef;
  @ViewChild('failPointsInput') failPointsInput: ElementRef;

  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService,  private router:Router, private ng2ImgToolsService: Ng2ImgToolsService) { }

  ngOnInit() {
    this.getCardCover();
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
    this.urlCopied = false;
    this.configUpdated = false;
    this.cardCoverUpdated=false;
    this.errorNoImageSelected=false;
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
  
  changeGamemode(id){
    this.configUpdated = false;
    this.cardCoverUpdated=false;
    this.errorNoImageSelected=false;
    this.urlCopied = false;
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
  }

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

  updateGamemode(){
    this.configUpdated = false;
    this.noValuePointsInput=false;
    this.cardCoverUpdated=false;
    this.errorNoImageSelected=false;
    if ((!this.inputSuccessPoints) && (!this.inputFailPoints)&&(!this.livesInput.nativeElement.value)){
      this.noValuePointsInput=true;
    }else{
      if(this.selectedGamemode==0){
        if (this.inputSuccessPoints){
          this.configUpdated = true;
          this._dataService.updateConfigPoints(this.selectedGamemode, 0, this.inputSuccessPoints).subscribe(data=>{
          });
        }
        if (this.inputFailPoints){
          this.configUpdated = true;
          this._dataService.updateConfigPoints(this.selectedGamemode, 1, this.inputFailPoints).subscribe(data=>{
          });
        }
      }
      else if(this.selectedGamemode==1){
        if(this.livesInput.nativeElement.value){
          this.configUpdated = true;
          this._dataService.updateConfigPoints(this.selectedGamemode, 2, this.inputLives).subscribe(data=>{
          });
        }
      }
    }
  }

  onFileSelected(event){
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = <File> event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      console.log(event.target.files[0]);
      this.url = reader.result; 
    }
  }

  getCardCover(){
    this._dataService.getConfig().subscribe(data=>{
      this.urlMostrar = data['cardCover'];
    });
  }

  updateCardCover(){
    if (this.selectedFile){
      this.errorNoImageSelected=false;
      const fd = new FormData();
      this.ng2ImgToolsService.resizeExactCrop([this.selectedFile], 258, 183).subscribe(result => {
        fd.append('file', result, this.selectedFile.name);
        this._dataService.uploadFile(fd).subscribe(data=>{
          let fileURL = data['file'];
          this._dataService.updateConfigCardCover(fileURL).subscribe(data=>{
            this.urlMostrar = AppSettings.API_ENDPOINT + fileURL;
            this.url = "";
            this.cardCoverUpdated=true;
          });
      })
      }, error => {
        console.log(error);
      });
    }else{
      this.errorNoImageSelected=true;
    }      
  }

  copyLink(id) {
    this.configUpdated = false;
    this.cardCoverUpdated=false;
    this.errorNoImageSelected=false;
    var text = "&collection=" + this.collections[id]._id;
    var event = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
        document.removeEventListener('copy', event);
    }
    document.addEventListener('copy', event);
    document.execCommand('copy');
    this.urlCopied = true;
  }
  
  changeStatus(id){
    this.urlCopied = false;
    this.configUpdated = false;
    this.cardCoverUpdated=false;
    this.errorNoImageSelected=false;
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
      var cardsCheck = this.collections[id].cards.split(',');  //Las cartas de la coleccion que deseo borrar y tengo que comprobar si en el caso de que no haya otra coleccion activa con esa carta la ponga a false
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
    this.collectionStatusUpdated = false;
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

}/// END OF COMPONENT GameConfigurationPanelComponent ///



