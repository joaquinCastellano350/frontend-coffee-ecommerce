import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.services';

export const authGuard: CanMatchFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.loading()) {
    await new Promise<void>((resolve) => {
      const i = setInterval(() => {
        if (!auth.loading()) {
          clearInterval(i);
          resolve();
        }
      }, 100);
    });
  }

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};
