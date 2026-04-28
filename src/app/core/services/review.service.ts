import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  // Enviar la reseña al backend
  createReview(requestId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}`, { rating, comment });
  }

  // Obtener reseñas de un servicio (para el Marketplace)
  getServiceReviews(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/${serviceId}`);
  }
}