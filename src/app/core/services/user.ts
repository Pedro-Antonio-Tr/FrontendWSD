import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; 

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios (Solo Admin)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Cambiar el estado activo/inactivo de un usuario
  toggleUserStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, {});
  }
}