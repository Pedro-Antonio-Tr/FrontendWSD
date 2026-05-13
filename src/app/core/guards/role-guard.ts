import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard de Roles: Protege rutas exclusivas para el Administrador.
 * Se asegura de que, aunque el usuario esté logueado, tenga el nivel de acceso adecuado.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Evita errores durante el renderizado en el servidor
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // LÓGICA DE AUTORIZACIÓN:
  // El servicio accede a la información del usuario (normalmente dentro del JWT)
  // y comprueba si el campo 'role' es exactamente 'admin'.
  if (authService.isAdmin()) {
    return true; // El acceso se concede al panel de administración
  }

  // Si el usuario es un cliente normal intentando entrar en /admin:
  // Lo expulsamos a la página de inicio.
  router.navigate(['/']);
  return false;
};