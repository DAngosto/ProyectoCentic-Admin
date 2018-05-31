//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//SERVICES
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
  data:boolean=false;

  constructor(private _dataService: DataService, private router:Router, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {
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
  EN:Function in charge of performing a specific search or displaying all the games played.
  ES:Función encargada de realizar una búsqueda específica o mostrar todas las partidas jugadas.
  */
  doSpecificSearch(){
    if (this.inputSearch==""){
      this.cleanCharts();
      this.showToast(2,"No se han jugado partidas con ese ID");
    }else{
      this.getAllItemsOfCollection(this.inputSearch);
    }
  }

  /*
  EN:Function in charge of performing a specific search for games played in a particular collection.
  ES:Función encargada de realizar una búsqueda específica de partidas juagadas de una colección en particular.
  */
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
      }else{
        this.inputSearch="";
        this.cleanCharts();
        this.showToast(2,"No se han jugado partidas con ese ID");
      }
    });
  }

  /*
  EN:Function in charge of deleting the data shown in the charts.
  ES:Función encargada de eliminar los datos mostrados en las gráficas.
  */
  cleanCharts(){
    $('#morris-donut-chart-gamemodevs').empty();
    $('#morris-bar-chart-jokersvs').empty();
    $('#morris-donut-chart-mostusedjokers').empty();
  }

  /*
  EN:Function in charge of entering the corresponding data in the charts.
  ES:Función encargada de introducir los datos corrspondientes en las gráficas.
  */
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
