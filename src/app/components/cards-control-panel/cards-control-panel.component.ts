import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { DataService } from '../../services/data.service';

import { Card } from '../../interfaces/Card';
import { Observable } from 'rxjs/observable';

import { ActivatedRoute, Router} from '@angular/router';




@Component({
  selector: 'app-cards-control-panel',
  templateUrl: './cards-control-panel.component.html',
  styleUrls: ['./cards-control-panel.component.css']
})
export class CardsControlPanelComponent implements OnInit {

  itemsTable: Observable<Card[]>;

  items: Card[] = [];
  visualizeImage: boolean = false;
  cardDeleted: boolean = false;
  noCards: boolean = false;
  url: any;
  nameDisplay: any;
  historyDisplay: any;
  tagsDisplay: any;
  //itemsPrueba: Observ;

 


  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService,  private router:Router) { }

  ngOnInit() {
    this._authenticationService.isUserValidated();
    this.getAllItems();

  }

  getAllItems(){
      this.clearData();
      this._dataService.getAllItems().subscribe(data=>{
          //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
          for(let i=0; i<data.length; i++){
              if (data[i].itemType=="0"){
                this.items.push(data[i]);
              }
              
          }

          if (this.items.length == 0){
            this.noCards = true;
          }else{
            this.noCards = false;
          }
      });
      
  }

  sawImage(id){
    this.cardDeleted = false;
    this.url = 'https://gameserver.centic.ovh' + this.items[id].fileURL;
    this.nameDisplay = this.items[id].name;
    this.historyDisplay = this.items[id].history;
    this.tagsDisplay = this.items[id].tags;
    this.visualizeImage = true;
  }

  updateCard(id){
    this._dataService.changeCard(this.items[id]);
    this.router.navigate(["/updateCard"]);
  }

  deleteCard(id){
    this.cardDeleted = false;
    this._dataService.deleteItem(this.items[id]._id).subscribe(data=>{
      this.clearData();
      this.cardDeleted = true;
      this.getAllItems();
    });
  }

  clearData(){
    this.items = [];
  }

}



