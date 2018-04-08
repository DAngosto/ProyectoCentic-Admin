import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http'; 
import { AuthenticationService } from './services/authentication.service';
import { MenuComponent } from './components/menu/menu.component';   // our custom service responsible of communications between the front-end and back-end of the application



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'menu',
        component: MenuComponent
      }
    ])
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
