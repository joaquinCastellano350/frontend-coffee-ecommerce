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

  async refreshSession(): Promise<SessionUser | null> {
    this.loading.set(true);
    try {
      const me = await this.http
        .get<SessionUser>('/auth/me', { withCredentials: true })
        .toPromise();

      if (me) {
        this.user.set(me);
        return me;
      } else {
        this.user.set(null);
        return null;
      }
    } catch {
      this.user.set(null);
      return null;
    } finally {
      this.loading.set(false);
    }
  }
  async register(email: string, password: string) {
    return this.http.post(`/auth/register`, { email, password }).toPromise();
  }

  async login(email: string, password: string) {
    await this.http.post(`/auth/login`, { email, password }).toPromise();
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
