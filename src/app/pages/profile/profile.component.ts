import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  CURRENT_USER: any = null;
  userFName: string;
  userLName: string;
  userPhoneNumber: string;
  userEmail: string;
  userPassword: string;
  userImage: string;
  modalRef: BsModalRef;
  uploadPercent: Observable<number>;
  isLoaded = false;
  modalSM = 'modal-sm modal-dialog-centered';
  constructor(private modalService: BsModalService, private storage: AngularFireStorage, private authService: AuthService) { }

  ngOnInit(): void {
    this.userCredential();
  }

  private userCredential(): void {
    this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
    this.userFName = this.CURRENT_USER['firstName'];
    this.userLName = this.CURRENT_USER['lastName'];
    this.userEmail = this.CURRENT_USER['email'];
    this.userPhoneNumber = this.CURRENT_USER['phoneNumber'];
    this.userImage = this.CURRENT_USER['image'];
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

  updateUserData(): void {
    this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
    const data = {
      image: this.userImage,
    }
    this.authService.updateUserData(this.CURRENT_USER.id, data).then(() => {
      this.updateLocal(data);
    });
    this.isLoaded = false;
    this.modalRef.hide();
  }

  private updateLocal(data): void {
    const local = {
      ...this.CURRENT_USER,
      ...data
    }
    localStorage.setItem('user', JSON.stringify(local))
  }
}
