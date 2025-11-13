import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../core/http/base-http.service';
import { firstValueFrom } from 'rxjs';

export type Role = 'admin' | 'user';
export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseHttpService {
  user = signal<SessionUser | null>(null);
  loading = signal<boolean>(true);
  constructor() {
    super();
    this.refreshSession();
  }

  refreshSession() {
    console.log('holaa');
    this.loading.set(true);
    this.http.get<SessionUser>(`/auth/me`).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.user.set(null);
        this.loading.set(false);
      },
    });
  }
  async register(email: string, password: string) {
    return this.http.post(`/auth/register`, { email, password }).toPromise();
  }

  async login(email: string, password: string) {
    //try {
    await this.http.post(`/auth/login`, { email, password }).toPromise();
    //} finally {
    //  return;
    //}
  }
  async logout() {
    try {
      await firstValueFrom(this.http.post(`/auth/logout`, {}));
    } finally {
      this.user.set(null);
      this.loading.set(false);
    }
  }
  refreshToken() {
    return this.http.post(`/auth/refresh`, {}, { withCredentials: true });
  }
  isLoggedIn() {
    return !!this.user();
  }
  isAdmin() {
    return this.user()?.role === 'admin';
  }
}
