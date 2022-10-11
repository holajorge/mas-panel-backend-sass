import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'convertJsonFotos'})

export class ConvertJsonFotosPipe implements PipeTransform {

  transform(json: string): any {
    
    let fotos = JSON.parse(json);

    if(fotos[0] !== undefined){
        return fotos[0].toLowerCase();
    }
    else{
        return "";
    }
  }

}
