import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard para invitados (Guests). 
 * Se asegura de que un usuario logueado no acceda a páginas como Login o Registro.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Verificación de plataforma (SSR): Evita errores si se ejecuta en el servidor
  if (!isPlatformBrowser(platformId)) return true;

  // LÓGICA DE CONTROL:
  // Si el servicio detecta que el usuario YA está autenticado...
  if (authService.isLoggedIn()) {
    // ...lo redirigimos automáticamente a la zona principal (Marketplace)
    router.navigate(['/marketplace']);
    return false; // Bloqueamos el acceso a la ruta solicitada (ej: /login)
  }

  // Si no está logueado, permitimos que entre a ver el Login o el Registro
  return true;
};