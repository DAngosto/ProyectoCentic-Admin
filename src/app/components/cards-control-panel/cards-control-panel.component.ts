import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { CardsService } from '../../services/cards.service';

import { Card } from '../../interfaces/Card';
import { Observable } from 'rxjs/observable';




@Component({
  selector: 'app-cards-control-panel',
  templateUrl: './cards-control-panel.component.html',
  styleUrls: ['./cards-control-panel.component.css']
})
export class CardsControlPanelComponent implements OnInit {

  itemsTable: Observable<Card[]>;

  items: Card[] = [];
  visualizeImage: boolean = false;
  url: any;
  //itemsPrueba: Observ;

  constructor(private _authenticationService: AuthenticationService, private _cardsService: CardsService) { }

  ngOnInit() {
    this._authenticationService.isUserValidated();
    this.getAllItems();

  }

  getAllItems(){
      this.itemsTable =  this._cardsService.getAllItems();

      this._cardsService.getAllItems().subscribe(data=>{
          //Solo guardamos para mostrar los que son del tipo 0 debido a que son las cartas
          for(let i=0; i<data.length; i++){
              if (data[i].itemType=="0"){
                this.items.push(data[i]);
              }
          }
      });
  }

  sawImage(id){
    this.url = 'https://gameserver.centic.ovh' + this.items[id].fileURL;
    this.visualizeImage = true;
  }
}
