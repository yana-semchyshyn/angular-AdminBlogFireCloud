import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Array<IProduct> = [];
  categoryTitle: string;
  constructor(private prodService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const category = this.activatedRoute.snapshot.paramMap.get('category');
        this.categoryTitle = category;
        this.getProducts(category);
      }
    });
  }

  ngOnInit(): void {
  }

  private getProducts(category: string): void {
    this.prodService.getCategoryProducts(category).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
    });
  }

  productCount(product: IProduct, status: boolean): void {
    if (status) product.count++;
    else if (product.count > 1) product.count--;
  }

  addToBasket(product: IProduct): void {
    this.orderService.addBasket(product);
    product.count = 1;
  }

}
