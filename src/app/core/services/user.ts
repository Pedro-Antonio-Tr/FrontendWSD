import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL para la gestión administrativa de usuarios
  private apiUrl = 'http://localhost:3000/api/users'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista completa de usuarios registrados.
   * Uso: Panel de Administración para auditoría y visualización de KPIs.
   */
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Bloquea o desbloquea a un usuario.
   * Implementa una lógica de 'toggle' (si está activo, lo desactiva y viceversa).
   */
  toggleUserStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, {});
  }
  
  /**
   * Cambia los privilegios de un usuario.
   * Permite promover a un usuario a 'admin' o degradarlo a 'user'.
   */
  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/role`, { role });
  }
}