import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  basket: Subject<Array<IProduct>> = new Subject<Array<IProduct>>();
  constructor() { }

  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.getItem('basket')){
      localProducts = JSON.parse(localStorage.getItem('basket'));
      if (localProducts.some(prod => prod.id === product.id)){
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else{
      localProducts.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(localProducts));
    this.basket.next(localProducts);
  }

  getTotal(products: Array<IProduct>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }
}
