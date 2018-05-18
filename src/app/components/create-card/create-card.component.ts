//MODULES
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//SERVICES
import { DataService } from '../../services/data.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css']
})

export class CreateCardComponent implements OnInit {

  selectedFile: File = null;
  inputName: string = "";
  inputHistory: string = "";
  inputTags: string = "";
  url: string = "";

  //Alarm Conditions
  errorNoImageSelected: boolean = false;
  errorNoInfo: boolean = false;
  cardUploaded: boolean = false;
  prevImage: boolean = false;

  constructor(private _authenticationService: AuthenticationService, private _dataService: DataService, private ng2ImgToolsService: Ng2ImgToolsService) { }

  ngOnInit() {
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

  uploadCard(){
    if (this.selectedFile){
      if((this.inputName!="")&&(this.inputHistory!="")){
        const fd = new FormData();
        this.ng2ImgToolsService.resizeExactCrop([this.selectedFile], 258, 183).subscribe(result => {
          fd.append('file', result, this.selectedFile.name);
          this._dataService.uploadFile(fd).subscribe(data=>{
            let fileURL = data['file'];
            this._dataService.uploadCard(this.inputName, this.inputHistory, this.inputTags, fileURL).subscribe(data=>{
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
        }, error => {
          console.log(error);
        });
      }else{
        this.cardUploaded = false;
        this.errorNoInfo = true;
        this.errorNoImageSelected = false;
      }
    }else {
      this.cardUploaded = false;
      this.errorNoImageSelected = true;
      this.errorNoInfo = false;
    }
  }

}/// END OF COMPONENT CreateCardComponent ///
  

  

