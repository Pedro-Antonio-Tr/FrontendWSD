import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMarketplaceService {
  // URL base para la gestión de servicios (CRUD)
  private apiUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los servicios disponibles con soporte para filtros.
   * @param filters Objeto opcional con texto de búsqueda y precio máximo.
   */
  getAllActiveServices(filters?: { search?: string, maxPrice?: number }): Observable<any[]> {
    // HttpParams permite construir una URL con parámetros limpios: ?search=valor&maxPrice=valor
    let params = new HttpParams();
    
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }

    // Realiza la petición GET enviando los parámetros de filtrado al backend
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  /**
   * Publica un nuevo servicio en el Marketplace.
   */
  createService(serviceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, serviceData);
  }

  /**
   * Modifica un servicio existente. Se usa PATCH para actualizaciones parciales.
   */
  updateService(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Elimina un servicio
   */
  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Recupera solo los servicios creados por el usuario logueado.
   */
  getMyServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-services`);
  }
}