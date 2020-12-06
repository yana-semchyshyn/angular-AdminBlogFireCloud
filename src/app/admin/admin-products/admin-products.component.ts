import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AngularFireStorage } from '@angular/fire/storage';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/classes/product.model';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit {
  searchProductName: string;
  categoryName: string;
  categories: Array<ICategory>;
  currentCategory: ICategory;
  isEdited = false;
  isChecked = false;
  isLoaded = false;
  modalLG = 'modal-lg modal-dialog-centered';
  modalSM = 'modal-sm modal-dialog-centered';
  productDescription: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productID: number | string;
  products: Array<IProduct>;
  product: IProduct;
  uploadPercent: Observable<number>;
  modalRef: BsModalRef;
  checkModel: any = { left: false, middle: true, right: false };
  constructor(private catService: CategoriesService,
              private prodService: ProductsService, 
              private modalService: BsModalService, 
              private storage: AngularFireStorage,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  private getCategories(): void {
    this.catService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });
  }

  private getProducts(): void {
    this.prodService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
    });
  }

  setCategory(): void {
    this.currentCategory = this.categories.filter(cat => cat.name === this.categoryName)[0];
  }

  checkProductFields(): void {
    if (this.categoryName == '' || this.productName == '' || this.productDescription == '' || this.productPrice == undefined || this.productImage == '') this.isChecked = true;
  }

  addProduct(): void {
    this.setCategory();
    this.checkProductFields();
    if (this.isChecked == false) {
      const newProd = new Product(
        1,
        this.currentCategory,
        this.productName,
        this.productDescription,
        this.productPrice,
        1,
        this.productImage
      );
      delete newProd.id;
      this.prodService.create(newProd).then(() => {
        this.toastr.success('Created new product successfully!');
      })
      this.modalRef.hide();
      this.resetForm();
    }
  }

  getProduct(product: IProduct): void {
    this.product = product;
  }

  editProduct(product: IProduct): void {
    this.productID = product.id;
    this.currentCategory = product.category;
    this.categoryName = product.category.name;
    this.productName = product.name;
    this.productDescription = product.description;
    this.productPrice = product.price;
    this.productImage = product.image;
    this.isEdited = true;
  }

  updateProduct(): void {
    this.checkProductFields();
    if (this.isChecked == false){
      const updProduct = new Product(this.productID, this.currentCategory, this.productName, this.productDescription, this.productPrice, 1, this.productImage);
      this.prodService.update(updProduct.id.toString(), updProduct)
      .then(() => this.toastr.success('The product was updated successfully!'))
      .catch(err => console.log(err));
      this.getProducts();
      this.modalRef.hide();
      this.resetForm();
      this.isEdited = false;
      this.isChecked = false;
    }
  }

  deleteProduct(prod: IProduct): void {
    this.prodService.delete(prod.id.toString())
      .then(() => {
        this.toastr.success('The product was deleted successfully!');
      })
      .catch(err => console.log(err));
    this.getProducts();
    this.modalRef.hide();
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
        this.productImage = url;
        this.isLoaded = true;
      });
    });
  }

  resetForm(): void {
    this.categoryName = '';
    this.productDescription = '';
    this.productName = '';
    this.productPrice = undefined;
    this.productImage = '';
    this.isLoaded = false;
  }
}
