import { Injectable } from '@angular/core';

declare var toastr:any;

@Injectable()
export class ToasterService {

  constructor() { }

  Success (title: string, message?: string){
    toastr.success(title,message);
  }

  Warning (title: string, message?: string){
    toastr.sarning(title,message);
  }

  Error (title: string, message?: string){
    toastr.error(title,message);
  }

  Info (title: string, message?: string){
    toastr.info(title,message);
  }

}
