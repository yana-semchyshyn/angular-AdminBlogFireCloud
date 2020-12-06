import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ICategory } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private dbPath = '/categories';
  categoriesRef: AngularFirestoreCollection<ICategory> = null;

  constructor(private db: AngularFirestore) {
    this.categoriesRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<ICategory> {
    return this.categoriesRef;
  }

  create(category: ICategory): any {
    return this.categoriesRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.categoriesRef.doc(id).update({...data});
  }

  delete(id: string): Promise<void> {
    return this.categoriesRef.doc(id).delete();
  }
}