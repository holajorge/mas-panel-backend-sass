import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'convertJsonFotos'})

export class ConvertJsonFotosPipe implements PipeTransform {

  transform(json: string): any {
    
    let fotos = JSON.parse(json);

    return fotos[0].toLowerCase();
  }

}
