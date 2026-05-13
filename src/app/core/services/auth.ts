import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Hace que el servicio sea un Singleton (una única instancia para toda la app)
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'timebank_jwt_token'; // Clave para guardar el JWT en el navegador

  // REACTIVIDAD: Usamos BehaviorSubject para que el saldo se actualice en tiempo real en toda la app
  private balanceSubject = new BehaviorSubject<number | null>(null);
  public currentBalance$ = this.balanceSubject.asObservable(); 

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Necesario para no romper el código en el servidor
  ) { }

  // Envía los datos de registro al backend
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Inicia sesión y, si es éxito, guarda el token usando el operador 'tap'
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const tokenReal = response?.token || response?.access_token;
        if (tokenReal) {
          this.setToken(tokenReal);
        }
      })
    );
  }

  // Obtiene los datos del usuario logueado y actualiza el saldo reactivo
  getProfile(): Observable<any> {
    return this.http.get('http://localhost:3000/api/users/me').pipe(
      tap((data: any) => {
        if (data && data.balance !== undefined) {
          this.balanceSubject.next(data.balance); // Notifica a todos los componentes del nuevo saldo
        }
      })
    );
  }
  
  // Limpia la sesión y resetea el saldo
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.balanceSubject.next(null);
  }

  // Guarda el JWT de forma persistente
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Recupera el token para que el Interceptor lo pueda usar
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null; 
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Lógica de Decodificación de JWT:
   * Los tokens JWT tienen 3 partes separadas por puntos. La segunda (payload) 
   * contiene los datos del usuario. Usamos 'atob' para decodificarla de Base64.
   */
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1]; 
      const decodedJson = atob(payload); 
      const decoded = JSON.parse(decodedJson);
      return decoded.role; 
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // Extrae el ID único del usuario del token
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.sub || payload.userId;
    } catch (e) {
      console.error('Error descifrando el token:', e);
      return null;
    }
  }
}