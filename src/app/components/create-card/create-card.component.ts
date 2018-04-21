import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { CardsService } from '../../services/cards.service';



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

  inputName: string = "";
  inputHistory: string = "";
  inputTags: string = "";


  constructor(private _cardsService: CardsService) { }

  ngOnInit() {
  }

  onFileSelected(event){
    this.selectedFile = <File> event.target.files[0];

  }

  uploadImage(){

    if (this.selectedFile){
      
         if((this.inputName!="")&&(this.inputHistory!="")){
          const fd = new FormData();
          fd.append('file', this.selectedFile, this.selectedFile.name);
          this._cardsService.uploadImage(fd).subscribe(data=>{
            let fileURL = data['file'];
            this._cardsService.uploadCard(this.inputName, this.inputHistory, this.inputTags, fileURL).subscribe(data=>{
              console.log(data);
              this.errorNoImageSelected = false;
              this.errorNoInfo = false;
              this.cardUploaded = true;
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
  

  

