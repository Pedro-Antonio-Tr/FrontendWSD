import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMarketplaceService {
  private apiUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  getAllActiveServices(filters?: { search?: string, maxPrice?: number }): Observable<any[]> {
    let params = new HttpParams();
    
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }

    // Le pasamos los parámetros a la petición HTTP
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  createService(serviceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, serviceData);
  }

  updateService(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMyServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-services`);
  }
}