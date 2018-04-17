import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public tokenUser;

  constructor(private router:Router) { }

  ngOnInit() {
    if (localStorage.getItem('tokenUser')) {
      this.tokenUser = localStorage.getItem('tokenUser');
      console.log("  Login realizado correctamente. El token ha sido: " + this.tokenUser);
      }else{
        this.tokenUser = "no hay token almacenado";
        console.log("  Login realizado correctamente. El token ha sido: " + this.tokenUser);
    }
  }

  disconnect(){
    console.log("entre en el disconnect");
    this.tokenUser = "";
    localStorage.removeItem('tokenUser');
    this.router.navigate(["/login"]);
  }

}
