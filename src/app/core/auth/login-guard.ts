import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.services';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../features/admin/components/confirm-dialog-component/confirm-dialog-component';

export const loginGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const u = await auth.refreshSession();
  if (!u) {
    return true;
  }

  const ref = dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {
      title: 'Continuar a Autenticarse',
      message: `Ya tienes una sesion iniciada como ${u.email}, deseas cerrar la sesión e iniciar en otra cuenta?`,
      confirmText: 'Mantener mi sesión',
      cancelText: 'Cerrar sesión',
    },
  });
  ref.afterClosed().subscribe((c) => {
    if (c) {
      router.navigate(['/?']);
    }
    if (!c) {
      auth.logout();
      router.navigate(['/login']);
    }
  });

  return false;
};
