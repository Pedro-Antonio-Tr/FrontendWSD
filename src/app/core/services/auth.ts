import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'timebank_jwt_token';

  // Inyectamos PLATFORM_ID para saber si estamos en el servidor o en el navegador
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Buscamos 'token' o 'access_token' (por si acaso NestJS usa el nombre por defecto)
        const tokenReal = response?.token || response?.access_token;
        if (tokenReal) {
          this.setToken(tokenReal);
        }
      })
    );
  }

  // Obtiene los datos del perfil del usuario logueado
  getProfile(): Observable<any> {
    return this.http.get('http://localhost:3000/api/users/me');
  }
  
  logout(): void {
    // Solo borramos si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private setToken(token: string): void {
    // Solo guardamos si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    // Solo leemos el localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    // Si el servidor (SSR) intenta leerlo, le decimos que no hay token
    return null; 
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}