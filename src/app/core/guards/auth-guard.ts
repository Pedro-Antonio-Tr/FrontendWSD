import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos el servicio de autenticación y el enrutador
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario tiene token, le abrimos la puerta
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está logueado, lo mandamos de vuelta a la pantalla de login
  router.navigate(['/login']);
  return false;
};