import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private tokenUser;

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('tokenUser')) {
      this.tokenUser = localStorage.getItem('tokenUser');
      }else{
        this.tokenUser = "no hay token almacenado";
    }
  }

}
