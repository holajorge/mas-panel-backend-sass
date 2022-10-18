import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'fotosS3'})

export class FotosS3Pipe implements PipeTransform {

  transform(img: string, bucket:string): any {
    
    var re = new RegExp("maspedidos/"+bucket+"/fotos/","g");
    img = img.replace(re, "");
    return img;
  }

}
