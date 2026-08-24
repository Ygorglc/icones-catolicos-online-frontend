import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/auth.model';

export const clientGuard: CanActivateFn = (_route, state) => verifyRole('CLIENTE', state.url);
export const adminGuard: CanActivateFn = (_route, state) => verifyRole('ADMINISTRADOR', state.url);

function verifyRole(expectedRole: UserRole, returnUrl: string) {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.hasRole(expectedRole)) return true;
  if (!auth.isAuthenticated()) return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
  return router.createUrlTree([auth.hasRole('ADMINISTRADOR') ? '/admin' : '/cliente/pedidos']);
}
