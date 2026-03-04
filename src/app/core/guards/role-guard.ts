import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si está logueado, por ahora le dejamos pasar. 
  // (En el Sprint 2 aquí leeremos el token para comprobar si su rol es 'ADMIN')
  if (authService.isLoggedIn()) {
    return true; 
  }

  router.navigate(['/login']);
  return false;
};