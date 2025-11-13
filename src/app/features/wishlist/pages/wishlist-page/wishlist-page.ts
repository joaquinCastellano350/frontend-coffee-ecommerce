import { Component, effect, inject, signal } from '@angular/core';
import { WishlistService } from '../../wishlist.service';
import { ProductsService } from '../../../catalog/products.service';
import { Product } from '../../../../shared/models/product.model';
import { ProductListComponent } from "../../../catalog/components/product-list-component/product-list-component";

@Component({
  selector: 'app-wishlist-page',
  imports: [ProductListComponent],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage {

  wishlist = inject(WishlistService);
  private service = inject(ProductsService);

  products = signal<Product[]>([]);

  ids = this.wishlist.getItems();

  constructor() {
    effect(() => {
      const ids = this.wishlist.getItems() || []
      this.loadProducts(ids);
    })
  }

  private loadProducts(ids: string[]) {
    this.products.set([])
    if (ids.length > 0) {
    this.service.getManyByIds(ids).subscribe(products => {
      this.products.set(products);
    });
  }
  

  }
}
