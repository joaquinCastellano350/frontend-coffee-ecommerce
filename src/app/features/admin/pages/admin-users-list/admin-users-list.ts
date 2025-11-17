import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserResponseDTO } from '../../../../shared/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from '../../components/confirm-dialog-component/confirm-dialog-component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-users-list',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './admin-users-list.html',
  styleUrl: './admin-users-list.css',
})
export class AdminUsersList {
  private service = inject(UsersService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  users = signal<UserResponseDTO[]>([]);
  loading = signal(true);

  displayedColumns = ['email', 'role', 'actions'];

  filters = this.fb.group({
    email: [''],
    role: [''],
  });

  constructor() {
    this.filters.patchValue(
      {
        role: '',
        email: '',
      },
      { emitEvent: false },
    );
    this.filters.valueChanges.pipe(debounceTime(250)).subscribe((v) => {
      console.log(v);
    });
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.service.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los usuarios: ', error);
        this.loading.set(false);
      },
    });
  }

  async changeRole(user: string, role: 'admin' | 'user') {
    const newRole = role === 'user' ? 'admin' : 'user';
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Cambiar Rol',
        message: `¿Estás seguro de actualizar el rol de ${user} a ${newRole}, se actualizarán los permisos del usuario.`,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
      },
    });
    const confirm = await ref.afterClosed().toPromise();
    if (!confirm) return;

    this.service.changeRole(user, newRole).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al cambiar el rol del usuario', error);
      },
    });
  }
}
