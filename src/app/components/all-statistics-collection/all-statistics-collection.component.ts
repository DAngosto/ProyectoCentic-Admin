//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { AuthenticationService } from '../../services/authentication.service';
import { DataService } from '../../services/data.service';

//CHARTS
declare var Morris:any;
declare var $:any;

@Component({
  selector: 'app-all-statistics-collection',
  templateUrl: './all-statistics-collection.component.html',
  styleUrls: ['./all-statistics-collection.component.css']
})

export class AllStatisticsCollectionComponent implements OnInit {

  inputSearch: string="";
  actualCards:number;
  actualCollections:number;
  actualCollectionsPublished:number;
  actualNumberOfGamesPlayed:number;
  actualArcadeGamesPlayed:number;
  actualSurvivalGamesPlayed:number;
  actualGamesWithJokers:number;
  actualGamesWithoutJokers:number;
  gamesWithMultiJoker:number;
  gamesWithVolteoJoker:number;
  gamesWithBothJokers: number;

  //Alarm Conditions
  sawCharts:boolean=false;
  data:boolean=false;
  sawNoData:boolean=false;

  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private router:Router) { }

  ngOnInit() {
  }

  doSpecificSearch(){
    console.log(this.inputSearch);
    if (this.inputSearch==""){
      this.cleanCharts();
      this.sawNoData=true;
    }else{
      this.getAllItemsOfCollection(this.inputSearch);
    }
  }

  getAllItemsOfCollection(id){
    this.data=false;
    this.actualCards = 0;
    this.actualCollections = 0;
    this.actualCollectionsPublished = 0;
    this.actualNumberOfGamesPlayed = 0;
    this.actualArcadeGamesPlayed = 0;
    this.actualSurvivalGamesPlayed = 0;
    this.actualGamesWithJokers = 0;
    this.actualGamesWithoutJokers = 0;
    this.gamesWithMultiJoker = 0;
    this.gamesWithVolteoJoker = 0;
    this.gamesWithBothJokers = 0;
    var searchedID="";
    if(id.charAt(0)=='&'){
      searchedID = id.substring(12,id.length);
    }else{
      searchedID = id;
    }
    this._dataService.getAllItemsGamesPlayed().subscribe(data=>{
      //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
      for(let i=0; i<data.length; i++){
        if (data[i].itemType=="2"){
          if(data[i].collectionID==searchedID){
            this.data=true;
            this.actualNumberOfGamesPlayed++;
            if(data[i].gamemode==0){
              this.actualArcadeGamesPlayed++;
              if((data[i].jokermultiwasted)||(data[i].jokervolteowasted)){
                this.actualGamesWithJokers++;
                if((data[i].jokermultiwasted)&&(!data[i].jokervolteowasted)){
                  this.gamesWithMultiJoker++;
                }else if((!data[i].jokermultiwasted)&&(data[i].jokervolteowasted)){
                  this.gamesWithVolteoJoker++;
                }else{
                  this.gamesWithBothJokers++;
                }
              }else{
                this.actualGamesWithoutJokers++;
              }
            }else if(data[i].gamemode==1){
              this.actualSurvivalGamesPlayed++;                
            }
          }
        }    
      }
      if(this.data){
        this.inputSearch=searchedID;
        this.loadStatistics();
        this.sawNoData=false;
      }else{
        this.inputSearch="";
        this.cleanCharts();
        this.sawNoData=true;
      }
    });
  }

  cleanCharts(){
    $('#morris-donut-chart-gamemodevs').empty();
    $('#morris-bar-chart-jokersvs').empty();
    $('#morris-donut-chart-mostusedjokers').empty();
  }

  loadStatistics(){
    this.cleanCharts();
    Morris.Donut({
      element: 'morris-donut-chart-gamemodevs',
      data: [
        {label: "Juegos Arcade", value: this.actualArcadeGamesPlayed},
        {label: "Juegos Survival", value:  this.actualSurvivalGamesPlayed}
      ]
    });

    Morris.Bar({
      element: 'morris-bar-chart-jokersvs',
      data: [
        { y: 'Partidas Modo Arcade', a: this.actualGamesWithJokers, b: this.actualGamesWithoutJokers },
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Con comodines', 'Sin comodines']
    });

    Morris.Donut({
      element: 'morris-donut-chart-mostusedjokers',
      data: [
        {label: "Juegos con comodín Multi", value: this.gamesWithMultiJoker},
        {label: "Juegos con comodín Volteo", value:  this.gamesWithVolteoJoker},
        {label: "Juegos con ambos comodines", value:  this.gamesWithBothJokers}
      ]
    });
  }

}/// END OF COMPONENT AllStatisticsCollectionComponent ///
