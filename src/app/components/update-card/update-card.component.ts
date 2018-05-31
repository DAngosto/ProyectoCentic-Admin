//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

//SERVICES
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
  sawImage: boolean = false;
  imgChanged: boolean = false;

  constructor(private _dataService: DataService, private router:Router, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {
    this.getCardForUpdate();
  }

  /*
  EN:Function in charge of displaying a Toast message on the screen.
  ES:Función encargada de mostrar un mensaje Toast en la pantalla.
  */
  showToast(type, message){
    switch(type){
      case 0:
            this.toastr.error(message);
            break;
      case 1:
            this.toastr.success(message);
            break;
      case 2:
            this.toastr.info(message);
            break;
      case 3:
            this.toastr.warning(message);
            break;
    }
  }

  /*
  EN:Function in charge of obtaining the information of the card susceptible to being modified and to introduce its data in the corresponding fields.
  ES:Función encargada de obtener la información de la carta susceptible a ser modificada e introducir sus datos en los campos correspondientes.
  */
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

  /*
  EN:Function in charge of storing the selected image to be the corresponding one on the back of the cards during the game.
  ES:Función encargada de almacenar la imagen seleccionada para ser la correspondiente del dorso de las cartas durante el juego.
  */
  onFileSelected(event){
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = <File> event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.url = reader.result;
      this.imgChanged = true;
    }
  }

  /*
  EN:Function in charge of updating the information of the selected card.
  ES:Función encargada de actualizar la información de la carta seleccionada.
  */
  updateCard(){
    if((this.cardUpdating)||((this.inputName!="")&&(this.inputHistory!=""))){
      if(!this.imgChanged){
        this.cardUpdating.name = this.inputName;
        this.cardUpdating.history = this.inputHistory;
        this.cardUpdating.tags = this.inputTags;
        this._dataService.updateCard(this.cardUpdating).subscribe(data=>{
          this.showToast(1,"La carta ha sido actualizada con exito");
        })
      }else{
        const fd = new FormData();
        fd.append('file', this.selectedFile, this.selectedFile.name);
        this._dataService.uploadFile(fd).subscribe(data=>{
          let fileURL = data['file'];
          this.cardUpdating.name = this.inputName;
          this.cardUpdating.history = this.inputHistory;
          this.cardUpdating.tags = this.inputTags;
          this.cardUpdating.fileURL = fileURL;
          this._dataService.updateCard(this.cardUpdating).subscribe(data=>{
            this.showToast(1,"La carta ha sido actualizada con exito");
          })
        })
      }
    }else{
      this,this.showToast(0,"Los campos nombre o historia estaban incompletos, por favor introduce la información correspondiente");
      if (!this.cardUpdating){
        this.showToast(0,"¡Selecciona una imágen antes de intentar crear una nueva carta!");
      }
    }
  }

}/// END OF COMPONENT UpdateCardComponent ///
