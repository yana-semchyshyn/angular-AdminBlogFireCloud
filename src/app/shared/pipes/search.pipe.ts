import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<ICategory>, field: string): Array<ICategory> {
    if (!field) {
      return value;
    }
    if (!value) {
      return [];
    }
    return value.filter(category => category.name.toLowerCase().includes(field.toLowerCase()));
  }

}
