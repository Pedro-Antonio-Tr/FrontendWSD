import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'timebank_jwt_token';

  private balanceSubject = new BehaviorSubject<number | null>(null);
  public currentBalance$ = this.balanceSubject.asObservable(); 

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
        const tokenReal = response?.token || response?.access_token;
        if (tokenReal) {
          this.setToken(tokenReal);
        }
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get('http://localhost:3000/api/users/me').pipe(
      tap((data: any) => {
        if (data && data.balance !== undefined) {
          this.balanceSubject.next(data.balance);
        }
      })
    );
  }
  
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.balanceSubject.next(null);
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null; 
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

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

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const miId = payload.id || payload.sub || payload.userId;
      return miId;
    } catch (e) {
      console.error('Error descifrando el token:', e);
      return null;
    }
  }
}