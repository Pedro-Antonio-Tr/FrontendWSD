import { inject, PLATFORM_ID } from '@angular/core'; // Para usar inyección de dependencias y detectar la plataforma
import { isPlatformBrowser } from '@angular/common'; // Para saber si estamos en el navegador
import { CanActivateFn, Router } from '@angular/router'; // Tipos de Angular para rutas y navegación
import { AuthService } from '../services/auth'; // Nuestro servicio que sabe si hay sesión

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos las herramientas necesarias (sustituye al constructor en funciones)
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // CONTROL DE SSR (Server Side Rendering): 
  // Si Angular se está ejecutando en el servidor (Node.js), dejamos pasar.
  // Esto evita errores porque en el servidor no existe el 'localStorage'.
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // REGLA DE SEGURIDAD PRINCIPAL:
  // Llamamos al servicio para ver si existe un token válido.
  if (authService.isLoggedIn()) {
    return true; // Puerta abierta: el usuario puede ver la página
  }

  // REDIRECCIÓN:
  // Si llegamos aquí es que no hay sesión. Lo mandamos al login.
  router.navigate(['/login']);
  return false; // Puerta cerrada: se cancela la carga del componente
};