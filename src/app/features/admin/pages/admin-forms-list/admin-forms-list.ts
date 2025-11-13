import { Component, inject, signal } from '@angular/core';
import { InterestFormService } from '../../../catalog/interest-form.service';
import { InterestForm } from '../../../../shared/models/form.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-forms-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './admin-forms-list.html',
  styleUrl: './admin-forms-list.css',
})
export class AdminFormsList {
  private service = inject(InterestFormService);
  items = signal<InterestForm[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.service.getAllForms().subscribe({
      next: (data) => this.items.set(data),
      error: (err) => console.error('Error al cargar consultas', err),
    });
  }
}
