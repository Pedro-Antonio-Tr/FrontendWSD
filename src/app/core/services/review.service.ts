import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  // Url para el sistema de valoraciones y reseñas
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva reseña.
   * @param requestId El ID de la solicitud (debe estar en estado COMPLETED para poder valorar)
   * @param rating Puntuación del 1 al 5
   * @param comment Texto de la opinión
   */
  createReview(requestId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}`, { rating, comment });
  }

  /**
   * Obtiene todas las reseñas de un servicio específico.
   * Se usa en el Marketplace para mostrar las estrellas de cada oferta.
   */
  getServiceReviews(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  /**
   * Uso para los admin: Obtiene todas las reseñas de la plataforma.
   */
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  /**
   * Uso para los admin: Modera una reseña.
   * No borra la puntuación, pero oculta el comentario ofensivo o inapropiado.
   */
  censorReview(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/censor`, {});
  }

  /**
   * Uso para los admin: Elimina una reseña por completo del sistema.
   */
  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}