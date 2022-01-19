import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fehaLarga'
})
export class FehaLargaPipe extends DatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    
    return super.transform(value, "EEEE d MMMM '\''yy H:mm");
  }

}
