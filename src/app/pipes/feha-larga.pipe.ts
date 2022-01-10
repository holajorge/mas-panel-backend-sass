import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fehaLarga'
})
export class FehaLargaPipe extends DatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    console.log(value);
    
    return super.transform(value, "EEEE d MMMM y h:mm a");
  }

}
