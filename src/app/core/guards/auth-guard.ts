import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos el servicio de autenticación y el enrutador
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // Si el usuario tiene token, le abrimos la puerta
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está logueado, lo mandamos de vuelta a la pantalla de login
  router.navigate(['/login']);
  return false;
};