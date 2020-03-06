import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  transform(value: any): any {
    // const values = value.split('').forEach((element, index) => {
    //   values[value.length - index + 1] = element;
    // }).join('');

    // return values;

    return value
      .split('')
      .reverse()
      .join('');
  }
}
