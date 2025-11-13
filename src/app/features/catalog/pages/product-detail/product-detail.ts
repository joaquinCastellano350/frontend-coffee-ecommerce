import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../shared/models/product.model';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFabButton } from '@angular/material/button';
import { WishlistService } from '../../../wishlist/wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InterestForm } from '../../components/interest-form/interest-form';

@Component({
  selector: 'app-product-detail',
  imports: [MatIcon, NgIf, MatCardModule, MatProgressSpinnerModule, MatFabButton],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private service = inject(ProductsService);
  private route = inject(ActivatedRoute);

  wishlist = inject(WishlistService);
  product = signal<Product | null>(null);
  image = signal<string>('/uploads/assets/placeholder.png');
  dialog = inject(MatDialog);
  snack = inject(MatSnackBar);
  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.service.getProductById(id).subscribe((p) => {
      this.product.set(p);
      if (p.imageURL) this.image.set(p.imageURL);
    });
  }

  openForm(productId: string, productName: string) {
    const ref = this.dialog.open(InterestForm, { data: { productId, productName } });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.snack.open('Gracias! Te contactaremos pronto.', 'Cerrar', { duration: 3000 });
    });
  }
}
