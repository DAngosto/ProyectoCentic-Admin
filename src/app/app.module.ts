import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

//componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CreateCardComponent } from './components/create-card/create-card.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';   // our custom service responsible of communications between the front-end and back-end of the application

//servicios
import { AuthenticationService } from './services/authentication.service';
import { CardsService } from './services/cards.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'newCard',component: CreateCardComponent },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    CreateCardComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }) //Poner a true en el caso de querer saber que ruta está itnenta encontrar
  ],
  providers: [AuthenticationService, CardsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
