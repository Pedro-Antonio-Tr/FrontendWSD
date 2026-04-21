import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) {}

  createRequest(serviceId: string): Observable<any> {
    return this.http.post(this.apiUrl, { serviceId });
  }

  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  updateRequestStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  getAllRequests(): Observable<any[]> { // Para admins
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}