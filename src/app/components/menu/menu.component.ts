import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router} from '@angular/router';




@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public tokenUser;
  actualCards:number;
  actualCollections:number;
  actualCollectionsPublished:number;
  actualNumberOfGamesPlayed:number;

  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private router:Router) { }

  ngOnInit() {

    this._authenticationService.isUserValidated();
    this.getAllItems();
    

    /*
    if (localStorage.getItem('tokenUser')) {
      this.tokenUser = localStorage.getItem('tokenUser');
      console.log("  Login realizado correctamente. El token ha sido: " + this.tokenUser);
      }else{
        this.tokenUser = "no hay token almacenado";
        console.log("  Login realizado correctamente. El token ha sido: " + this.tokenUser);
    }
    */

   

    /*
    if(dd<10) {
      dd='0'+dd
    } 

    if(mm<10) {
      mm='0'+mm
    } 
    

    hoy = mm +'/'+dd+'/'+yyyy; 
    */
  }

  getAllItems(){
    this.actualCards = 0;
    this.actualCollections = 0;
    this.actualCollectionsPublished = 0;
    this.actualNumberOfGamesPlayed = 0;
    this._dataService.getAllItems().subscribe(data=>{
        //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
        for(let i=0; i<data.length; i++){
            if (data[i].itemType=="0"){
              this.actualCards++;
            }
            else if (data[i].itemType=="1"){
              this.actualCollections++;
              if(data[i].publish==true){
                this.actualCollectionsPublished++;
              }
            }
            else if (data[i].itemType=="2"){
              this.actualNumberOfGamesPlayed++;
            }

            
        }
    });
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
