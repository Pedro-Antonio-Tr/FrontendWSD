import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(requestId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}`, { rating, comment });
  }

  getServiceReviews(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  censorReview(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/censor`, {});
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}