import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Esta es la URL de tu backend de NestJS donde está escuchando el controller
  private apiUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}

  // Método para procesar la compra (conecta directo con tu transactions.controller.ts del backend)
  transferCredits(data: { receiverId: string, amount: number, concept: string, serviceId?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, data);
  }

  // Método para ver el historial en el perfil (lo dejamos ya listo)
  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }
}