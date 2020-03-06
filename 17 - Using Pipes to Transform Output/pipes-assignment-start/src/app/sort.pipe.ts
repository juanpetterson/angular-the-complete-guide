import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform(value: any, propName: string): any {
    return value.sort((value1, value2) => {
      if (value1[propName] === value2[propName]) {
        return 0;
      }

      return value1[propName] > value2[propName] ? 1 : -1;
    });
  }
}
