import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';
import { Category } from '../../../../shared/models/category.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { QuickCreateDialogComponent } from '../../components/quick-create-dialog-component/quick-create-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-admin-category-list',
  imports: [CommonModule, NgIf, MatIcon, MatButtonModule, MatTableModule, MatProgressBarModule],
  templateUrl: './admin-category-list.html',
  styleUrl: './admin-category-list.css',
})
export class AdminCategoriesList {
  private service = inject(CategoriesService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  categories = signal<Category[]>([]);
  loading = signal(true);

  displayedColumns = ['name', 'actions'];

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.service.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las categorías:', error);
        this.loading.set(false);
      },
    });
  }

  goNew() {
    const ref = this.dialog.open(QuickCreateDialogComponent, {
      data: { title: 'Nueva Categoria', label: 'Nombre de la categoria' },
      width: '380px',
    });
    ref.afterClosed().subscribe((v) => {
      if (!v) return;
      this.service.createCategory(v).subscribe(() => {
        this.loadCategories();
      });
    });
  }

  goEdit(id: string) {
    const categoriesValue = this.categories();
    const category = categoriesValue.find((cat) => cat._id === id);
    if (!category?._id) return;

    const ref = this.dialog.open(QuickCreateDialogComponent, {
      data: {
        title: 'Editar Categoría',
        label: 'Nombre de la categoría',
        value: category.name,
      },
      width: '380px',
    });

    ref.afterClosed().subscribe((v) => {
      if (!v) return;

      this.service.updateCategory(category._id!, v!).subscribe(() => {
        this.loadCategories();
      });
    });
  }
}
