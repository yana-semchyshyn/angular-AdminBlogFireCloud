import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: Array<IProduct> = [];
  product: IProduct;
  totalPrice = 0;
  modalSM = 'modal-sm modal-dialog-centered';
  modalRef: BsModalRef;
  checkModel: any = { left: false, middle: true, right: false };
  constructor(private orderService: OrderService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getLocalProducts();
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.orderService.getTotal(this.basket);
    }
  }

  updateData(): void {
    this.totalPrice = this.orderService.getTotal(this.basket);
    this.orderService.basket.next(this.basket);
    localStorage.setItem('basket', JSON.stringify(this.basket));
  }

  productCount(product: IProduct, status: boolean): void {
    if (status) product.count++;
    else {
      if (product.count > 1) product.count--;
    }
    this.updateData();
  }

  getProduct(prod: IProduct): void {
    this.product = prod;
  }

  removeProduct(product: IProduct): void {
    const index = this.basket.findIndex(prod => prod.id === product.id);
    this.basket.splice(index, 1);
    this.updateData();
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>, modalWidth): void {
    const config: ModalOptions = { class: `${modalWidth}` };
    this.modalRef = this.modalService.show(template, config);
  }
}
