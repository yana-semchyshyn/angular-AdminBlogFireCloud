import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  checkSignIn: Subject<boolean> = new Subject<boolean>();
  userRef: AngularFirestoreCollection<any>;
  private dbPath = '/users';
  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router) {
    this.userRef = this.db.collection(this.dbPath);
  }

  signUp(firstName: string, lastName: string, phoneNumber: string, email: string, password: string, image: string): void {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        const user = {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: userResponse.user.email,
          image: image,
          role: 'user'
        };
        this.db.collection('users').add(user);
        this.db.collection('users').ref.where('email', '==', userResponse.user.email).onSnapshot(
          snap => {
            snap.forEach(user => {
              const myUser = {
                id: user.id,
                ...user.data() as any
              }
              localStorage.setItem('user', JSON.stringify(myUser));
              this.checkUser();
            })
          }
        )
      })
      .catch(err => console.log(err));
  }

  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        this.db.collection('users').ref.where('email', '==', userResponse.user.email).onSnapshot(
          snap => {
            snap.forEach(user => {
              const myUser = {
                id: user.id,
                ...user.data() as any
              }
              localStorage.setItem('user', JSON.stringify(myUser));
              this.checkUser();
            })
          }
        )
      })
  }

  checkUser(): void {
    const CURRENT_USER = JSON.parse(localStorage.getItem('user'));
    if (CURRENT_USER.role != 'admin') {
      this.checkSignIn.next(true);
      this.router.navigateByUrl('profile');
    }
    else {
      this.checkSignIn.next(true);
      this.router.navigateByUrl('admin');
    }
  }


  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('home');
      });
  }

  updateUserData(id: string, data: any): Promise<void> {
    return this.userRef.doc(id).update({ ...data });
  }
}
