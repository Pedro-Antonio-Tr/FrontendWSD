import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  // Url para la gestión de solicitudes de servicio
  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) {}

  /**
   * Inicia el proceso de intercambio.
   * Crea una solicitud con estado 'PENDING'.
   */
  createRequest(serviceId: string): Observable<any> {
    return this.http.post(this.apiUrl, { serviceId });
  }

  /**
   * Obtiene todas las solicitudes donde el usuario actual es o el COMPRADOR o el PROVEEDOR.
   * Útil para mostrar el historial y las notificaciones en el Perfil.
   */
  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  /**
   * Cambia el estado de una solicitud (ej: de PENDING a ACCEPTED, o de ACCEPTED a COMPLETED).
   * Al pasar a 'COMPLETED', es cuando el backend dispara la transferencia de créditos.
   */
  updateRequestStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Uso exclusivo para el Administrador.
   * Permite auditar todos los intercambios que ocurren en la plataforma.
   */
  getAllRequests(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}