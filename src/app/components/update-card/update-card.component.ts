//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

//SERVICES
import {AuthenticationService} from '../../services/authentication.service';
import { DataService } from '../../services/data.service';

//INTERFACES
import { Card } from '../../interfaces/Card';

//SETTINGS
import {AppSettings} from '../../AppSettings';

@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styleUrls: ['./update-card.component.css']
})

export class UpdateCardComponent implements OnInit {

  cardUpdating:Card;
  selectedFile: File = null;
  inputName: string = "";
  inputHistory: string = "";
  inputTags: string = "";
  url: string = "";

  //Alarm Conditions
  errorNoImageSelected: boolean = false;
  errorNoInfo: boolean = false;
  cardUploaded: boolean = false;
  sawImage: boolean = false;
  imgChanged: boolean = false;

  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private router:Router) { }

  ngOnInit() {
    this._authenticationService.isUserValidated();
    this.getCardForUpdate();
  }

  getCardForUpdate() {
    this._dataService.currentCardUpdating.subscribe(cardUpdating => this.cardUpdating = cardUpdating);
    if(!this.cardUpdating){
      this.router.navigate(["/cardsCP"]);
    }else{
      this.inputName = this.cardUpdating.name;
      this.inputHistory = this.cardUpdating.history;
      this.inputTags = this.cardUpdating.tags;
      this.url = AppSettings.API_ENDPOINT + this.cardUpdating.fileURL;
      this.sawImage = true;
    }
  }

  onFileSelected(event){
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = <File> event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.url = reader.result;
      this.errorNoImageSelected = false;
      this.imgChanged = true;
    }
  }

  updateCard(){
    if((this.cardUpdating)||((this.inputName!="")&&(this.inputHistory!=""))){
      //Si no ha cambiado la imagen no hace falta volver a subirla para obtener un nuevo fileURL
      if(!this.imgChanged){
        //Actualizamos los campos que puedan haber cambiado
        this.cardUpdating.name = this.inputName;
        this.cardUpdating.history = this.inputHistory;
        this.cardUpdating.tags = this.inputTags;
        this._dataService.updateCard(this.cardUpdating).subscribe(data=>{
          this.errorNoImageSelected = false;
          this.errorNoInfo = false;
          this.cardUploaded = true;
        })
      }else{
        //Subimos la nueva imagen y actualizamos la carta
        const fd = new FormData();
        fd.append('file', this.selectedFile, this.selectedFile.name);
        this._dataService.uploadFile(fd).subscribe(data=>{
          let fileURL = data['file'];
          this.cardUpdating.name = this.inputName;
          this.cardUpdating.history = this.inputHistory;
          this.cardUpdating.tags = this.inputTags;
          this.cardUpdating.fileURL = fileURL;
          this._dataService.updateCard(this.cardUpdating).subscribe(data=>{
            this.errorNoImageSelected = false;
            this.errorNoInfo = false;
            this.cardUploaded = true; 
          })
        })
      }
    }else{
      this.cardUploaded = false;
      this.errorNoInfo = true;
      if (!this.cardUpdating){
        this.errorNoImageSelected = true;
      }else{
        this.errorNoImageSelected = false;
      }
    }
  }

}/// END OF COMPONENT UpdateCardComponent ///
