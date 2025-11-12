import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/auth.services';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule , NgIf, RouterOutlet, RouterLink ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   auth = inject(AuthService);

  constructor() {
    this.auth.refreshSession();
  }

  protected readonly title = signal('frontend-coffee-ecommerce');
}
