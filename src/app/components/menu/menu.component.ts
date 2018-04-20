import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public tokenUser;

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('tokenUser')) {
      this.tokenUser = localStorage.getItem('tokenUser');
      console.log("  Login realizado correctamente. El token ha sido: " + this.tokenUser);
      }else{
        this.tokenUser = "no hay token almacenado";
        console.log("  Login realizado correctamente. El token ha sido: " + this.tokenUser);
    }
  }

 

}
