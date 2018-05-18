//MODULES
import { Component, OnInit } from '@angular/core';

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

  //Alarm Conditions
  noGames:boolean=false;
  noGamesWithSpecificTag:boolean=false;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this.getAllItems();
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
      this.noGamesWithSpecificTag = false;
      if (this.itemsArcade.length == 0){
        this.noGames = true;
      }else{
        this.noGames = false;
      }
      if (this.itemsSurvival.length == 0){
        this.noGames = true;
      }else{
        this.noGames = false;
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
      this.noGames = false;
      this.inputSearch = "";
      if(this.selectedGamemode==0){
        if (this.itemsArcade.length == 0){
          this.noGamesWithSpecificTag = true;
        }else{
          this.noGamesWithSpecificTag = false;
        }
      }else if(this.selectedGamemode==1){
        if (this.itemsSurvival.length == 0){
          this.noGamesWithSpecificTag = true;
        }else{
          this.noGamesWithSpecificTag = false;
        }
      }   
    });
  }

  clearData(){
    this.itemsArcade = [];
    this.itemsSurvival = [];
  }

}/// END OF COMPONENT AllStatisticsComponent ///
