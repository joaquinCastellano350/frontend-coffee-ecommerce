import { Component, Input } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { WishlistService } from '../../../wishlist/wishlist.service';
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list-component',
  imports: [CommonModule, NgFor, MatCardModule, MatButton, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.css',
})
export class ProductListComponent {

  @Input() products: Product[] = [];
  constructor(public wishlist : WishlistService) {}
}
