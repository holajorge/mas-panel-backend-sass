import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'bannersImg'})

export class BannersImgPipe implements PipeTransform {

  transform(img: string, bucket:string, type:number=1): any {
    
    if(type == 2){
      return `https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/${bucket}/adjuntos/${img}`;
    }
    if(img!=''){
      return `https://maspedidos.s3.us-west-2.amazonaws.com/maspedidos/${bucket}/fotos/${img}`;
    }else{
      return '/assets/img/pordefecto.png';
    }
  }

}
