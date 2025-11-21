import { Component, inject, signal } from '@angular/core';
import { CatalogsService } from '../../services/catalogs.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Catalog } from '../../../../shared/models/catalog.model';
import { CommonModule, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-catalogs-list',
  imports: [CommonModule, NgIf, MatIcon, MatButtonModule, MatTableModule],
  templateUrl: './admin-catalogs-list.html',
  styleUrl: './admin-catalogs-list.css',
})
export class AdminCatalogsList {
  private service = inject(CatalogsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  catalogs = signal<Catalog[]>([]);
  loading = signal(true);

  displayedColumns = ['name', 'totalProducts', 'startedAt', 'endedAt', 'actions'];
  constructor() {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.loading.set(true);
    this.service.getCatalogs().subscribe({
      next: (catalogs) => {
        this.catalogs.set(catalogs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los catalogos: ', error);
        this.loading.set(false);
      },
    });
  }
  goNew() {
    this.router.navigate(['/admin/catalogs/new']);
  }
  goEdit(id: string) {
    this.router.navigate([`/admin/catalogs/edit/${id}`]);
  }
  async enableCatalog(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Activar catalogo',
        message: `Si activas este catálogo se desactivará el que está activo actualmente. Deseas  continuar?`,
        confirmText: 'Activar y continuar',
        cancelText: 'Cancelar',
      },
    });
    const confirm = await ref.afterClosed().toPromise();
    if (!confirm) return false;
    try {
      await this.service.enableCatalog(id).toPromise();
      this.loadCatalogs();
      this.snack.open('Catálogo activado', 'Cerrar', { duration: 2000 });
      return true;
    } catch (error) {
      console.error(error);
      this.snack.open('Error al activar el catálogo', 'Cerrar', { duration: 3000 });
      return false;
    }
  }
  async disableCatalog(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Desactivar catálogo',
        message: `Si desactivas el catálogo ningún catálogo quedara visible para los usuarios. Deseas continuar?`,
        confirmText: 'Activar y continuar',
        cancelText: 'Cancelar',
      },
    });
    const confirm = await ref.afterClosed().toPromise();
    if (!confirm) return false;
    try {
      await this.service.disableCatalog(id).toPromise();
      this.loadCatalogs();
      this.snack.open('Catálogo desactivado', 'Cerrar', { duration: 2000 });
      return true;
    } catch (error) {
      console.error(error);
      this.snack.open('Error al desactivar el catálogo', 'Cerrar', { duration: 3000 });
      return false;
    }
  }
}
