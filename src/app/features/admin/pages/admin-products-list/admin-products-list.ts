import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../../catalog/products.service';
import { Router } from '@angular/router';
import { Product } from '../../../../shared/models/product.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-admin-products-list',
  imports: [CommonModule, NgIf, MatIcon, MatButtonModule, MatTableModule],
  templateUrl: './admin-products-list.html',
  styleUrl: './admin-products-list.css',
})
export class AdminProductsList {
  private service = inject(ProductsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  products = signal<Product[]>([]);
  loading = signal(true);

  displayedColumns = ['name', 'brand', 'category', 'price', 'catalog', 'visibility', 'actions'];
  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.service.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los productos:', error);
        this.loading.set(false);
      },
    });
  }

  goNew() {
    this.router.navigate(['/admin/products/new']);
  }

  goEdit(id: string) {
    this.router.navigate([`/admin/products/edit/${id}`]);
  }

  async deleteProduct(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar producto',
        message:
          '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });
    const confirm = await ref.afterClosed().toPromise();
    if (!confirm) return;

    this.service.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      },
    });
  }
}
