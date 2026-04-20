import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) {}

  // 1. Crear una nueva solicitud (Desde el Marketplace)
  createRequest(serviceId: string): Observable<any> {
    return this.http.post(this.apiUrl, { serviceId });
  }

  // 2. Obtener mis solicitudes (Para la pestaña de "My Requests" en el Perfil)
  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  // 3. Cambiar el estado (Aceptar, Rechazar, Completar)
  updateRequestStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }
}