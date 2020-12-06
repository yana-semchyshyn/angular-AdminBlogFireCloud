import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private dbPath = '/products';
  productsRef: AngularFirestoreCollection<IProduct> = null;
  currentProduct: Array<any>;
  constructor(private db: AngularFirestore) {
    this.productsRef = this.db.collection(this.dbPath);
  }

  getCategoryProducts(category: string): AngularFirestoreCollection<IProduct> {
    return this.db.collection(this.dbPath, ref => ref.where('category.name', '==', category));
  }

  getProduct(id: string): any {
    return this.productsRef.doc(id).get();
  }

  getAll(): AngularFirestoreCollection<IProduct> {
    return this.productsRef;
  }

  create(product: IProduct): any {
    return this.productsRef.add({ ...product });
  }

  update(id: string, data: any): Promise<void> {
    return this.productsRef.doc(id).update({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.productsRef.doc(id).delete();
  }
}
