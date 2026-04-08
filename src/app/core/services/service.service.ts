import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMarketplaceService {
  private apiUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  getAllActiveServices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createService(serviceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, serviceData);
  }
}