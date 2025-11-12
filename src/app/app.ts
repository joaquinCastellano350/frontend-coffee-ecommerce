import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/auth.services';
import { CommonModule, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [CommonModule , NgIf, RouterOutlet, RouterLink, MatDivider, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  auth = inject(AuthService);
  router = inject(Router)
  constructor() {
    this.auth.refreshSession();
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['']);
  }

  protected readonly title = signal('frontend-coffee-ecommerce');
}
