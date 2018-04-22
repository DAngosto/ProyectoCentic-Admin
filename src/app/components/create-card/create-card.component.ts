import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { CardsService } from '../../services/cards.service';
import {AuthenticationService} from '../../services/authentication.service';



@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css']
})

export class CreateCardComponent implements OnInit {

  selectedFile: File = null;
  errorNoImageSelected: boolean = false;
  errorNoInfo: boolean = false;
  cardUploaded: boolean = false;
  prevImage: boolean = false;

  inputName: string = "";
  inputHistory: string = "";
  inputTags: string = "";

  url: string = "";


  constructor(private _authenticationService: AuthenticationService, private _cardsService: CardsService) { }

  ngOnInit() {

    this._authenticationService.isUserValidated();
  }

  onFileSelected(event){
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = <File> event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
        this.prevImage = true;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.url = reader.result;
      this.errorNoImageSelected = false;
    }
  }

  uploadImage(){

    if (this.selectedFile){
      
         if((this.inputName!="")&&(this.inputHistory!="")){
          const fd = new FormData();
          fd.append('file', this.selectedFile, this.selectedFile.name);
          this._cardsService.uploadFile(fd).subscribe(data=>{
            let fileURL = data['file'];
            this._cardsService.uploadCard(this.inputName, this.inputHistory, this.inputTags, fileURL).subscribe(data=>{
              console.log(data);
              this.errorNoImageSelected = false;
              this.errorNoInfo = false;
              this.prevImage = false;
              this.cardUploaded = true;
              this.inputName = "";
              this.inputHistory = "";
              this.inputTags = "";
              this.url = "";    
            })
          })
        }else{
          this.errorNoInfo = true;
          this.errorNoImageSelected = false;
         }
    }else {
      this.errorNoImageSelected = true;
      this.errorNoInfo = false;
    }
    


    
  }

}
  

  

