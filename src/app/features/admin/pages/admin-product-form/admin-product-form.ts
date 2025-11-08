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
import { CategoriesService } from '../../services/categories.service';
import { CatalogsService } from '../../services/catalogs.servicec';
import { QuickCreateDialogComponent } from '../../components/quick-create-dialog-component/quick-create-dialog-component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-product-form',
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule,MatInputModule,MatSelectModule,MatCardModule,MatSnackBarModule, QuickCreateDialogComponent],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoriesService);
  private catalogService = inject(CatalogsService);
  private service = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  categories = signal<{name:string , slug:string, _id:string}[]>([]);
  catalogs = signal<{name:string , slug:string, _id:string, visible:boolean}[]>([]);

  private lastCategoryId: string | null = null;
  private lastCatalogId: string | null = null;

  isEdit = signal(false);
  id: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    brand: [''],
    category_id: [''],
    catalog_id: [''],
    description: [''],
    price: [0, Validators.min(0)],
    stock: [0, Validators.min(0)],
    imageUrl: [''],
  });

  ngOnInit() {
    this.service.getCategories().subscribe((cats) => {
      this.categories.set(cats);

    });
    this.catalogService.getCatalogs().subscribe((cats) => {
      this.catalogs.set(cats);

    });
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit.set(true);
      this.loadProduct(this.id);
    }
  }

  loadProduct(id: string) {
    this.service.getProductById(id).subscribe((product) => {
      if (product.imageURL) {
        this.imagePreview = `http://localhost:3000${product.imageURL}`;
      }
      this.lastCatalogId = product.catalog_id?._id || null;
      this.lastCategoryId = product.category_id?._id || null;

      this.form.patchValue({...product , category_id: product.category_id?._id , catalog_id: product.catalog_id?._id });
      console.log(product);
    },
    (error) => {
      this.snack.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
    }
    );
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const productData = this.form.value;

    await this.ensureCatalogEnabled();
    


    const request = this.isEdit() ? this.service.updateProduct(this.id!, productData as UpdateProductDTO, this.selectedFile || undefined) : this.service.createProduct(productData as CreateProductDTO, this.selectedFile || undefined);
    
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



  async onCategoryChange(value: string) {
  if (value !== '__create__') { this.lastCategoryId = value; return; }


  const name = await this.openQuickCreate('Nueva categoría', 'Nombre de la categoría');

  if (!name) { this.form.patchValue({ category_id: this.lastCategoryId }); return; }

  this.categoryService.createCategory(name).subscribe({
    next: (cat) => {
      this.categories.set([...this.categories(), cat]);
      this.form.patchValue({ category_id: cat._id });
      this.lastCategoryId = cat._id;
      this.snack.open('Categoría creada', 'Cerrar', { duration: 2000 });
    },
    error: () => {
      this.snack.open('No se pudo crear la categoría', 'Cerrar', { duration: 3000 });
      this.form.patchValue({ category_id: this.lastCategoryId });
    }
  });
}

async ensureCatalogEnabled() : Promise<boolean> {
  console.log(this.form.value.catalog_id);
  const catalogId = this.form.value.catalog_id as string;

  const catalog = this.catalogs().find(c => c._id === catalogId);
  if (catalog && catalog.visible) {
    return true;
  }
  const ref = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {
      title: 'Catálogo inactivo',
      message: `El catálogo “${catalog?.name}” no está activo. ¿Deseás activarlo ahora? 
                (Se desactivarán los demás catálogos)`,
      confirmText: 'Activar y continuar',
      cancelText: 'Continuar sin activarlo'
    }
  });
  const confirm = await ref.afterClosed().toPromise();
  if (!confirm) return false;
  try {
    await this.catalogService.enableCatalog(catalogId).toPromise();
    this.catalogs.set(this.catalogs().map(c => ({...c, visible: c._id === catalogId})));
    this.snack.open('Catálogo activado', 'Cerrar', { duration: 2000 });
    return true;
  } catch (error) {
    this.snack.open('Error al activar el catálogo', 'Cerrar', { duration: 3000 });
    return false;
  }
}


async onCatalogChange(value: string) {
  if (value !== '__create__') { this.lastCatalogId = value; return; }

  const name = await this.openQuickCreate('Nuevo catálogo', 'Nombre del catálogo');
  if (!name) { this.form.patchValue({ catalog_id: this.lastCatalogId || '' }); return; }

  this.catalogService.createCatalog(name).subscribe({
    next: (cat) => {
      this.catalogs.set([...this.catalogs(), cat]);
      this.form.patchValue({ catalog_id: cat._id });
      this.lastCatalogId = cat._id;
      this.snack.open('Catálogo creado', 'Cerrar', { duration: 2000 });
    },
    error: () => {
      this.snack.open('No se pudo crear el catálogo', 'Cerrar', { duration: 3000 });
      this.form.patchValue({ catalog_id:  this.lastCatalogId || '' });
    }
  });
}
private openQuickCreate(title: string, label: string): Promise<string | null> {
  const ref = this.dialog.open(QuickCreateDialogComponent, {
    data: { title, label },
    width: '380px'
  });
  return ref.afterClosed().toPromise();
}

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  this.selectedFile = file;
  if (file) {
    this.imagePreview = URL.createObjectURL(file);
  } else {
    this.imagePreview = null;
  }
}
  clearImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
