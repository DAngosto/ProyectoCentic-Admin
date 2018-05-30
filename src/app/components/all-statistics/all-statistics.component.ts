//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


//SERVICES
import { DataService } from '../../services/data.service';

//INTERFACES
import { GamePlayed } from '../../interfaces/GamePlayed';

@Component({
  selector: 'app-all-statistics',
  templateUrl: './all-statistics.component.html',
  styleUrls: ['./all-statistics.component.css']
})

export class AllStatisticsComponent implements OnInit {

  itemsArcade: GamePlayed[] = [];
  itemsSurvival: GamePlayed[] = [];
  
  inputSearch:string;
  selectedGamemode:number=0;


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
    this._dataService.getAllItemsGamesPlayed().subscribe(data=>{
      //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="2"){
          if(data[i].gamemode==0){
            this.itemsArcade.push(data[i]);
          }else if(data[i].gamemode==1){
            this.itemsSurvival.push(data[i]);
          }
        }    
      }
      if (this.itemsArcade.length == 0){
        this.showToast(2,"No se han jugado partidas del modo de juego arcade");
      }
      if (this.itemsSurvival.length == 0){
        this.showToast(2,"No se han jugado partidas del modo de juego survival");
      }
    });
  }

  setGamemode(gamemode){ 
    var aux = gamemode.toLowerCase();
    if (aux=="arcade"){
      this.selectedGamemode = 0;
    }else if (aux=="survival"){
      this.selectedGamemode = 1;
    } 
  }

  doSpecificSearch(){
    if (this.inputSearch==""){
      this.getAllItems();
    }else{
      this.getSpecificItems(this.inputSearch);
    }
  }

  getSpecificItems(id){
    this.clearData();
    var searchedID;
    if(id.charAt(0)=='&'){
      searchedID = id.substring(12,id.length);
    }else{
      searchedID = id;
    }
    this._dataService.getAllItemsGamesPlayed().subscribe(data=>{
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="2"){
          if(data[i].gamemode==this.selectedGamemode){
            if(data[i].collectionID==searchedID){
              if(data[i].gamemode==0){
                this.itemsArcade.push(data[i]);
              }else if(data[i].gamemode==1){
                this.itemsSurvival.push(data[i]);
              }
            }
          } 
        }
      }
      this.inputSearch = "";
      if(this.selectedGamemode==0){
        if (this.itemsArcade.length == 0){
          this.showToast(2,"No se han jugado partidas con ese ID");
        }
      }else if(this.selectedGamemode==1){
        if (this.itemsSurvival.length == 0){
          this.showToast(2,"No se han jugado partidas con ese ID");
        }
      }   
    });
  }

  clearData(){
    this.itemsArcade = [];
    this.itemsSurvival = [];
  }

}/// END OF COMPONENT AllStatisticsComponent ///
