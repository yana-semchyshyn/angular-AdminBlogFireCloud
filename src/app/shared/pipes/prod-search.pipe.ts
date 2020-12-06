import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'prodSearch'
})
export class ProdSearchPipe implements PipeTransform {

  transform(value: Array<IProduct>, field: string): Array<IProduct> {
    if (!field) {
      return value;
    }
    if (!value) {
      return [];
    }
    return value.filter((contact) => {
      return contact.name.includes(field) || contact.category.name.includes(field);
    });
  }

}
