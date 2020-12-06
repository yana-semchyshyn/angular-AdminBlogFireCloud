import { Injectable } from '@angular/core';
import { IBlog } from '../interfaces/blog.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private dbPath = '/blogs';
  blogsRef: AngularFirestoreCollection<any> = null;
  constructor(private db: AngularFirestore) {
    this.blogsRef = this.db.collection(this.dbPath);
  }

  getBlog(id: string): any {
    return this.blogsRef.doc(id).get();
  }

  getAll(): AngularFirestoreCollection<IBlog> {
    return this.blogsRef;
  }

  create(category: IBlog): any {
    return this.blogsRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.blogsRef.doc(id).update({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.blogsRef.doc(id).delete();
  }
}