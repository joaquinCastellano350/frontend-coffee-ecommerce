import {Injectable, signal, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseHttpService } from '../../core/http/base-http.service';

export type Role = 'admin' | 'user';
export interface SessionUser {id: string; email: string; role: Role;}

@Injectable({providedIn: 'root'})
export class AuthService extends BaseHttpService{
  

  user = signal<SessionUser | null>(null);
  loading = signal<boolean>(true);
  constructor() {
    super();
    this.refreshSession();
  }

  refreshSession() {
    this.loading.set(true);
    this.http.get<SessionUser>(`/auth/me`).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.user.set(null);
        this.loading.set(false);
      }
    })
  }
  async register(email: string, password: string) {
    return this.http.post(`/auth/register`, {email, password}).toPromise();
  }

  async login(email: string, password: string) {
    return this.http.post(`/auth/login`, {email, password}).toPromise();
  }
  isLoggedIn() {return !!this.user();}
  isAdmin() {return this.user()?.role === 'admin';}
}