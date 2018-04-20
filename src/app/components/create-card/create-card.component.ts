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
  cardUploaded: boolean = false;

  constructor(private _cardsService: CardsService) { }

  ngOnInit() {
  }

  onFileSelected(event){
    this.selectedFile = <File> event.target.files[0];

  }

  uploadImage(){

    if (this.selectedFile){
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);
      this._cardsService.uploadImage(fd).subscribe(data=>{
        console.log(data);

        this.cardUploaded = true;
        //let fileURL = data['file'];
        //console.log("la url de la imagen subida es: https://gameserver.centic.ovh/files/" + fileURL);
      } );
      //this.cardUploaded = true;
    } else {
      this.errorNoImageSelected = true;
    }
    



  /*

    let files = this.elem.nativeElement.querySelector('#selectFile').files;
    let formData:FormData = new FormData(); 
    let file = files[0];
    formData.append("file",file, file.name);
    this._cardsService.uploadImage(formData).subscribe(data=>{
      console.log("entro dentro del suscribe de imagen");
      let fileURL = data['file'];
      console.log("la url de la imagen subida es: https://gameserver.centic.ovh/files/" + fileURL);
    } );

    /*
    //var formData = new FormData($("#imageCard"));

    let fileList: FileList = event.target.files; 
    if(fileList.length > 0) {  
      let file: File = fileList[0];
      let formData:FormData = new FormData(); 
      console.log(file);
      formData.append("file",file)
      console.log(formData);
      this._cardsService.uploadImage(formData).subscribe(data=>{
        console.log("entro dentro del suscribe de imagen");
        let fileURL = data['file'];
        console.log("la url de la imagen subida es: https://gameserver.centic.ovh/files/" + fileURL);
      } );
      */



    /*formData.append("file",event.target.files[0]);
    console.log(event.target.files[0]);
    console.log(formData);
		if(event.target.files.length>0){
      console.log("entro al if de la imagen");
      
			this._cardsService.uploadImage(formData).subscribe(data=>{
        console.log("entro dentro del suscribe de imagen");
        let fileURL = data['file'];
        console.log("la url de la imagen subida es: https://gameserver.centic.ovh/files/" + fileURL);
      } );
      
		}else{
			console.log("no se subio la imagen");
    }*/
    
    
  }
  

  
}
