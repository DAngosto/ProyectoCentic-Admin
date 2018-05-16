import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2ImgToolsModule } from 'ng2-img-tools'; 

//componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CreateCardComponent } from './components/create-card/create-card.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';   // our custom service responsible of communications between the front-end and back-end of the application

//servicios
import { AuthenticationService } from './services/authentication.service';
import { DataService } from './services/data.service';
import { CardsControlPanelComponent } from './components/cards-control-panel/cards-control-panel.component';
import { UpdateCardComponent } from './components/update-card/update-card.component';
import { CollectionsControlPanelComponent } from './components/collections-control-panel/collections-control-panel.component';
import { CreateCollectionComponent } from './components/create-collection/create-collection.component';
import { UpdateCollectionComponent } from './components/update-collection/update-collection.component';
import { GameConfigurationPanelComponent } from './components/game-configuration-panel/game-configuration-panel.component';
import { AllStatisticsComponent } from './components/all-statistics/all-statistics.component';
import { AllStatisticsCollectionComponent } from './components/all-statistics-collection/all-statistics-collection.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cardsCP',component: CardsControlPanelComponent },
  { path: 'newCard',component: CreateCardComponent },
  { path: 'updateCard',component: UpdateCardComponent },
  { path: 'collectionsCP',component: CollectionsControlPanelComponent },
  { path: 'newCollection',component: CreateCollectionComponent },
  { path: 'updateCollection',component: UpdateCollectionComponent },
  { path: 'GameConfigCP',component: GameConfigurationPanelComponent },
  { path: 'AllStatisticsCollection',component: AllStatisticsCollectionComponent },
  { path: 'AllStatistics',component: AllStatisticsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    CreateCardComponent,
    NavBarComponent,
    CardsControlPanelComponent,
    UpdateCardComponent,
    CollectionsControlPanelComponent,
    CreateCollectionComponent,
    UpdateCollectionComponent,
    GameConfigurationPanelComponent,
    AllStatisticsComponent,
    AllStatisticsCollectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Ng2ImgToolsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }) //Poner a true en el caso de querer saber que ruta está itnenta encontrar
  ],
  providers: [AuthenticationService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
