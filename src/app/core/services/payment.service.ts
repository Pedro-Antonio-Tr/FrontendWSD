import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación de forma global
})
export class PaymentService {
  // URL base para los endpoints de pagos en nuestro servidor NestJS
  private apiUrl = 'http://localhost:3000/api/payments'; 

  constructor(private http: HttpClient) {}

  /**
   * PASO 1: Iniciar la compra.
   * Envía al backend la cantidad de créditos que el usuario quiere comprar.
   * El backend responde con una URL de Stripe.
   */
  createCheckoutSession(amount: number): Observable<{ checkoutUrl: string }> {
    return this.http.post<{ checkoutUrl: string }>(`${this.apiUrl}/checkout`, { amount });
  }

  /**
   * PASO 2: Verificar el éxito.
   * Cuando Stripe redirige al usuario de vuelta a nuestra web, nos da un 'session_id'.
   * Este método le pregunta a nuestro backend: "¿Es real este pago y se ha completado?"
   */
  verifyPayment(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify?session_id=${sessionId}`);
  }
}