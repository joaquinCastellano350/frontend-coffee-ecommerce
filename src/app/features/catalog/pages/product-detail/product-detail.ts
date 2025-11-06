import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../shared/models/product.model';
import { MatIcon } from "@angular/material/icon";
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFabButton, MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  imports: [MatIcon, NgIf, MatCardModule, MatProgressSpinnerModule, MatFabButton, MatAnchor, NgFor],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private service = inject(ProductsService)
  private route = inject(ActivatedRoute)

  baseUrl = 'http://localhost:3000'
  product = signal<Product | null>(null)
  image = signal<string>('assets/placeholder.png')
  category = signal<{name:string}>({name: 'default'})
  wished = signal(false)

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.service.getProductById(id).subscribe(p => {
      this.product.set(p);
      if (p.imageURL) this.image.set(p.imageURL)
      
    })
  }

  toggleWishlist(){this.wished.set(!this.wished())}
}
