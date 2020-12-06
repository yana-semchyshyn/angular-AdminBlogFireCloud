import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  basket: Array<IProduct> = [];
  totalPrice = 0;
  modalRef: BsModalRef;
  userFName: string;
  userLName: string;
  userPhoneNumber: string;
  userEmail: string;
  userPassword: string;
  userImage: string;
  modalLG = 'modal-lg modal-dialog-centered';
  modalSM = 'modal-sm modal-dialog-centered';
  isUser = false;
  isAdmin = false;
  isLogin: boolean;
  isLoaded = false;
  uploadPercent: Observable<number>;
  constructor(private orderService: OrderService, private modalService: BsModalService, private authService: AuthService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.checkMyBasket();
    this.checkUserLogin();
    this.checkLocalUser();
  }
  private checkMyBasket(): void {
    this.orderService.basket.subscribe(
      data => {
        this.basket = data;
        this.totalPrice = this.orderService.getTotal(this.basket);
      }
    );
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.orderService.getTotal(this.basket);
    }
  }

  resetForm(): void {
    this.userEmail = '';
    this.userPassword = '';
  }

  signUP(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signUp(this.userFName, this.userLName, this.userPhoneNumber, this.userEmail, this.userPassword, this.userImage);
      this.resetForm();
      this.modalRef.hide();
    }
  }

  signIN(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signIn(this.userEmail, this.userPassword);
      this.resetForm();
      this.modalRef.hide();
    }
  }

  setUserImage(): void {
    if (localStorage.getItem('user')) {
      const CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      this.userImage = CURRENT_USER['image'];
    }
  }

  signOUT(): void {
    this.authService.signOut();
    this.isLogin = false;
    this.isAdmin = false;
    this.isUser = false;
  }

  checkLocalUser(): void {
    if (localStorage.getItem('user')) {
      this.isLogin = true;
      if (JSON.parse(localStorage.getItem('user')).role == 'admin') this.isAdmin = true;
      else this.isUser = true;
      this.setUserImage();
    }
    else {
      this.isLogin = false;
      this.isAdmin = false;
      this.isUser = false;
    }
  }

  checkUserLogin(): void {
    this.authService.checkSignIn.subscribe(() => {
      this.checkLocalUser();
    })
  }

  openModal(template: TemplateRef<any>, modalWidth): void {
    const config: ModalOptions = { class: `${modalWidth}` };
    this.modalRef = this.modalService.show(template, config);
  }


  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.userImage = url;
        this.isLoaded = true;
      });
    });
  }

}