// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SessionStore } from './session-store.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private session = inject(SessionStore);

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${environment.apiBaseUrl}/auth/login`, data)
      .pipe(
        tap(res => {
          this.session.setSession(res.accessToken, res.user);
        })
      );
  }

  logout() {
    this.session.clear();
  }
}
