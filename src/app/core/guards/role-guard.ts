import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // Verificamos si realmente es admin leyendo el token
  if (authService.isAdmin()) {
    return true; 
  }

  // Si no es admin, lo mandamos a la pantalla de inicio
  router.navigate(['/']);
  return false;
};