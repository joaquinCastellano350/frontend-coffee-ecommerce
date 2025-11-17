import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/http/base-http.service';
import { UserResponseDTO } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseHttpService {
  getUsers() {
    return this.http.get<UserResponseDTO[]>('/auth/users', { withCredentials: true });
  }
  changeRole(userEmail: string, role: 'admin' | 'user') {
    return this.http.patch(`/auth/change-role/${userEmail}/${role}`, {});
  }
}
