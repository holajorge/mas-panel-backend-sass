import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'fotosS3'})

export class FotosS3Pipe implements PipeTransform {

  transform(img: string, bucket:string): any {

    var re = img.split("/");
    return re[3];
  }

}
