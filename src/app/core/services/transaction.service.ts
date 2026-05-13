import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // URL para el registro y consulta de movimientos con TC
  private apiUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}

  /**
   * Ejecuta una transferencia de TC entre usuarios.
   * @param data Objeto con el ID del receptor, la cantidad, el concepto y opcionalmente el ID del servicio vinculado.
   */
  transferCredits(data: { receiverId: string, amount: number, concept: string, serviceId?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, data);
  }

  /**
   * Obtiene el historial personal del usuario logueado.
   * Muestra tanto los ingresos (+) como los gastos (-) de TC.
   */
  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }

  /**
   * Uso para admin: Permite ver absolutamente todas las transacciones de la plataforma.
   * Es fundamental para los KPIs de volumen económico global.
   */
  getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}