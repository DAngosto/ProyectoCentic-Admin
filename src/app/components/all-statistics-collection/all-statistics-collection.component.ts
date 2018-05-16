import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router} from '@angular/router';

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

  sawCharts:boolean=false;
  data:boolean=false;
  sawNoData:boolean=false;


  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private router:Router) { }

  ngOnInit() {

    this._authenticationService.isUserValidated();
    //this.getAllItems();
  }

  doSpecificSearch(){
    if (this.inputSearch==""){
    }
    else{
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
                console.log("entro 1º");
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
                console.log("entro 2º");
                this.actualSurvivalGamesPlayed++;                
              }
            }
          }

            
        }

        console.log(this.data);

        this.inputSearch="";
        if(this.data){
          this.loadStatistics();
          this.sawNoData=false;

        }else{
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

    //Limpiamos los datos que ya estuvieran
    Morris.Donut({
      element: 'morris-donut-chart-gamemodevs',
      data: [
        {label: "Arcade Games", value: this.actualArcadeGamesPlayed},
        {label: "Survival Games", value:  this.actualSurvivalGamesPlayed}
      ]
    });

    Morris.Bar({
      element: 'morris-bar-chart-jokersvs',
      data: [
        { y: 'Partidas', a: this.actualGamesWithJokers, b: this.actualGamesWithoutJokers },
      ],
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Con comodines', 'Sin comodines']
    });

    Morris.Donut({
      element: 'morris-donut-chart-mostusedjokers',
      data: [
        {label: "Games with Multi Joker", value: this.gamesWithMultiJoker},
        {label: "Games with Volteo Joker", value:  this.gamesWithVolteoJoker},
        {label: "Games with Both Jokers", value:  this.gamesWithBothJokers}
      ]
    });
    

    /*
		//Cremos el objeto de estadisticas
		for(let cuestionario of this.cuestionariosEst){
			if(cuestionario._id==id){
				$('#cuestionarioActivo').html('Estadísticas de <b>'+cuestionario.nombre+'</b>');
				for(let p of cuestionario.preguntas ){
					var obj = {y:cont,a:p.estadisticas[0],b:p.estadisticas[1],c:p.estadisticas[2],d:p.estadisticas[3], todo:p}
					result.push(obj);
					cont++;
				}
			}
    }
    

   Morris.Donut({
    element: 'morris-donut-chart-gamemodevs',
    data: [
      {label: "Download Sales", value: 12},
      {label: "In-Store Sales", value: 30},
      {label: "Mail-Order Sales", value: 20}
    ]
  });
  */
  }

  /*
  swapScreen(option){
    switch(option){
      case 0:
        this.router.navigate(["/cardsCP"]);
        break;
      case 1:
        this.router.navigate(["/collectionsCP"]);
        break;
      case 2:
        this.router.navigate(["/GameConfigCP"]);
        break;
      case 3:
        this.router.navigate(["/StatisticsCP"]);
        break;
    }

  }
  */

 

}
