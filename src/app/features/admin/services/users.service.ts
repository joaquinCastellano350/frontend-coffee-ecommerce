import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/http/base-http.service';
import { UserResponseDTO } from '../../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseHttpService {
  getUsers(query: { email?: string; role?: 'admin' | 'user' }) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<UserResponseDTO[]>('/auth/users', {
      params: params,
      withCredentials: true,
    });
  }
  changeRole(userEmail: string, role: 'admin' | 'user') {
    return this.http.patch(`/auth/change-role/${userEmail}/${role}`, {});
  }
}
