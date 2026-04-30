import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments'; 

  constructor(private http: HttpClient) {}

  /**
   * @param amount Cantidad de Time Credits a comprar
   */
  createCheckoutSession(amount: number): Observable<{ checkoutUrl: string }> {
    return this.http.post<{ checkoutUrl: string }>(`${this.apiUrl}/checkout`, { amount });
  }

  verifyPayment(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify?session_id=${sessionId}`);
  }
}