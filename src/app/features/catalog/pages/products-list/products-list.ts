import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../products.service';
import { Product } from '../../../../shared/models/product.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, NgFor, MatCardModule, MatButton],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  private service = inject(ProductsService);
  products = signal<Product[]>([]);
  
  baseUrl = 'http://localhost:3000';
  constructor() {
    this.service.getProducts().subscribe((data) => {
      this.products.set(data);
    });
  }
}
