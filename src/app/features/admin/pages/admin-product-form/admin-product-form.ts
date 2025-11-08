import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsService } from '../../../catalog/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductDTO, UpdateProductDTO } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-admin-product-form',
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule,MatInputModule,MatSelectModule,MatCardModule,MatSnackBarModule],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm {
  private fb = inject(FormBuilder);
  private service = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  isEdit = signal(false);
  id: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    brand: [''],
    category: [''],
    description: [''],
    price: [0, Validators.min(0)],
    stock: [0, Validators.min(0)],
    imageUrl: [''],
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit.set(true);
      this.loadProduct(this.id);
    }
  }

  loadProduct(id: string) {
    this.service.getProductById(id).subscribe((product) => {
      this.form.patchValue(product);
    },
    (error) => {
      this.snack.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
    }
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const productData = this.form.value;

    const request = this.isEdit() ? this.service.updateProduct(this.id!, productData as UpdateProductDTO) : this.service.createProduct(productData as CreateProductDTO);
    
    request.subscribe({
      next: () => {
        this.snack.open(
          this.isEdit() ? 'Producto actualizado con éxito' : 'Producto creado con éxito',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.snack.open(
          'Error al guardar el producto',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
