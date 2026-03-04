import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio para poder acceder al token
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si el usuario tiene un token guardado, modificamos la petición
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Enviamos la petición modificada con el token al servidor
    return next(clonedReq);
  }

  // Si no hay token (por ejemplo, cuando se está registrando o haciendo login),
  // dejamos que la petición pase tal cual, sin modificar.
  return next(req);
};