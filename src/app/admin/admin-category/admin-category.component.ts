import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/shared/classes/category.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  categories: Array<ICategory>;
  category: ICategory;
  categoryID: number | string;
  categoryName: string;
  isEdited = false;
  isChecked = false;
  modalRef: BsModalRef;
  searchName: string;
  modalSM = 'modal-sm modal-dialog-centered';
  modalCenter = 'modal-dialog-centered'
  checkModel: any = { left: false, middle: true, right: false };
  constructor(private catService: CategoriesService, private modalService: BsModalService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCategories();
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

  checkCategory(): void{
    if (this.categoryName == '') this.isChecked = true;
    else{
      this.categories.forEach(element => {
        if (element.name == this.categoryName){
          return this.isChecked = true;
        }
      });
    }
  }

  addCategory(): void {
    this.checkCategory();
    if (this.isChecked == false || this.categories.length == 0) {
      const newCat = new Category(1, this.categoryName);
      delete newCat.id;
      this.catService.create(newCat).then(() => {
        console.log('Created new item successfully!');
      })
      this.modalRef.hide();
      this.resetForm();
    }
    this.isChecked = false;
  }

  getCategory(cat: ICategory): void {
    this.category = cat;
  }

  deleteCategory(cat: ICategory): void {
    this.catService.delete(cat.id.toString()).then(() => {
      this.toastr.success('The blog was deleted successfully!');
    })
    .catch(err => console.log(err));
    this.getCategories();
    this.modalRef.hide(); 
  }

  editCategory(category: ICategory): void {
    this.categoryID = category.id;
    this.categoryName = category.name;
    this.isEdited = true;
  }
  
  updateCategory(): void {
    this.checkCategory();
    if (!this.isChecked) {
      const updCategory = new Category(this.categoryID, this.categoryName);
      this.catService.update(updCategory.id.toString(), updCategory)
      .then(() => this.toastr.success('The blog was updated successfully!'))
      .catch(err => console.log(err));
      this.getCategories();
      this.modalRef.hide();
      this.resetForm();
      this.isEdited = false;
    }
    this.isChecked = false;
  }

  openModal(template: TemplateRef<any>, modalStyle): void {
    const config: ModalOptions = { class: `${modalStyle}`};
    this.modalRef = this.modalService.show(template, config);
  }

  resetForm(): void {
    this.categoryName = '';
    if (this.isEdited) this.isEdited = !this.isEdited;
  }

}
