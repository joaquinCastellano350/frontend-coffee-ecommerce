import { Component, inject, OnInit, signal } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { CountedProductDTO } from '../../../../shared/models/product.model';
import { InterestForm } from '../../../catalog/components/interest-form/interest-form';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/auth.services';

@Component({
  selector: 'app-admin-stats',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css',
})
export class AdminStats implements OnInit {
  auth = inject(AuthService);
  private service = inject(StatsService);
  totalForms = signal<number>(0);
  totalProducts = signal<number>(0);
  totalWished = signal<number>(0);
  activeCatalog = signal<string>('');
  askedProducts = signal<Partial<CountedProductDTO>[]>([]);
  wishedProducts = signal<Partial<CountedProductDTO>[]>([]);
  latestsForms = signal<Partial<InterestForm>[]>([]);

  displayedColumns = ['client', 'email', 'product', 'date'];

  ngOnInit(): void {
    this.loadSummary();
    this.loadAsked();
    this.loadWished();
    this.loadForms();
  }

  private loadSummary() {
    this.service.countActiveProducts().subscribe((t) => {
      this.totalProducts.set(t.total);
    });
    this.service.countLatestsForms().subscribe((t) => {
      this.totalForms.set(t.total);
    });
    this.service.countWishedProducts().subscribe((t) => {
      this.totalWished.set(t.total);
    });
    this.service.findActiveCatalog().subscribe((v) => {
      this.activeCatalog.set(v.name);
    });
  }
  private loadAsked() {
    this.service.findMostAsked().subscribe((p) => {
      this.askedProducts.set(p);
    });
  }
  private loadWished() {
    this.service.findMostFaved().subscribe((p) => {
      this.wishedProducts.set(p);
    });
  }
  private loadForms() {
    this.service.findLatestsForms().subscribe((f) => {
      this.latestsForms.set(f);
    });
  }
}
