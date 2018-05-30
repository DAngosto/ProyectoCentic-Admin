//MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


//SERVICES
import { DataService } from '../../services/data.service';
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
  prevImage: boolean = false;


  

  constructor(private _dataService: DataService, private ng2ImgToolsService: Ng2ImgToolsService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {
  }

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
              this.prevImage = false;
              this.showToast(1,"La carta ha sido creada con exito");
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
        this.showToast(0,"Los campos nombre o historia estaban incompletos, por favor introduce la información correspondiente");
      }
    }else {
      this.showToast(0,"¡Selecciona una imagen antes de intentar crear una nueva carta!");
    }
  }

}/// END OF COMPONENT CreateCardComponent ///
  

  

