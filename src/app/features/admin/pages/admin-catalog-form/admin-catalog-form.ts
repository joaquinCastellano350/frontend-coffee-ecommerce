import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CatalogsService } from '../../services/catalogs.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateCatalogDTO } from '../../../../shared/models/catalog.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export interface ICatalogForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  startedAt: FormControl<Date | null>;
  endedAt: FormControl<Date | null>;
}

@Component({
  selector: 'app-admin-catalog-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    RouterLink,
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }],
  templateUrl: './admin-catalog-form.html',
  styleUrl: './admin-catalog-form.css',
})
export class AdminCatalogForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CatalogsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  public catalogForm!: FormGroup<ICatalogForm>;
  isEdit = signal(false);
  id: string | null = null;

  ngOnInit() {
    this.catalogForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startedAt: [null],
      endedAt: [null],
    }) as FormGroup<ICatalogForm>;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit.set(true);
      this.loadCatalog(this.id);
    }
  }

  loadCatalog(id: string) {
    this.service.getCatalogById(id).subscribe(
      (catalog) => {
        this.catalogForm.patchValue(catalog);
      },
      (error) => {
        console.error(error);
        this.snack.open('Error al cargar el catalogo', 'Cerrar', { duration: 3000 });
      },
    );
  }

  async onSubmit() {
    if (this.catalogForm.invalid) return;

    const catalogData = this.catalogForm.value;

    const req = this.isEdit()
      ? this.service.updateCatalog(this.id!, catalogData as Partial<CreateCatalogDTO>)
      : this.service.createCatalog(catalogData as CreateCatalogDTO);

    req.subscribe({
      next: () => {
        this.snack.open(
          this.isEdit() ? 'Catálogo actualizado con éxito' : 'Catálogo creado con éxtio',
          'Cerrar',
          { duration: 2500 },
        );
        this.router.navigate(['/admin/catalogs']);
      },
      error: (error) => {
        console.error(error);
        this.snack.open('Error   al guardar el catálogo', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
