import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user'; 
import { CommonModule } from '@angular/common';
import { ServiceMarketplaceService } from '../../../core/services/service.service';
import { RequestService } from '../../../core/services/request.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { ReviewService } from '../../../core/services/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  activeTab: 'users' | 'services' | 'requests' | 'transactions' | 'reviews' = 'users';

  users: any[] = [];
  services: any[] = [];
  requests: any[] = [];
  transactions: any[] = [];
  reviews: any[] = [];
  searchTerm: string = '';

  stats = {
    totalUsers: 0,
    totalServices: 0,
    totalExchanges: 0
  };

  recentUsers: any[] = [];

  constructor(
    private userService: UserService,
    private marketplaceService: ServiceMarketplaceService,
    private requestService: RequestService,
    private transactionService: TransactionService,
    private reviewService: ReviewService // <-- Inyectado
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.stats.totalUsers = data.length;
      }
    });

    this.marketplaceService.getAllActiveServices().subscribe({
      next: (data) => {
        this.services = data;
        this.stats.totalServices = data.length;
      }
    });

    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.stats.totalExchanges = data.filter((r: any) => r.status === 'COMPLETED').length;
      }
    });

    this.transactionService.getAllTransactions().subscribe({
      next: (data) => this.transactions = data
    });

    this.reviewService.getAllReviews().subscribe({
      next: (data) => this.reviews = data
    });
  }

  cambiarEstado(userId: string): void {
    this.userService.toggleUserStatus(userId).subscribe({
      next: () => this.cargarTodo(),
      error: (err) => console.error('Error al cambiar estado', err)
    });
  }

  deleteService(serviceId: string): void {
    if (confirm('Admin Override: Are you sure you want to permanently delete this service?')) {
      this.marketplaceService.deleteService(serviceId).subscribe({
        next: () => this.cargarTodo()
      });
    }
  }

  censorReview(reviewId: string): void {
    if (confirm('Are you sure you want to censor the text of this review? This action cannot be undone.')) {
      this.reviewService.censorReview(reviewId).subscribe({
        next: () => {
          this.cargarTodo();
          alert('Review censored successfully.');
        },
        error: (err) => alert('Error censoring review')
      });
    }
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you absolutely sure you want to delete this review entirely?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.cargarTodo();
          alert('Review deleted successfully.');
        },
        error: (err) => alert('Error deleting review')
      });
    }
  }

  get filteredUsers() {
    if (!this.searchTerm) {
      return this.users;
    }
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user => 
      user.fullName?.toLowerCase().includes(term) || 
      user.email?.toLowerCase().includes(term)
    );
  }

  // Añade este método en tu AdminDashboard
  cambiarRol(user: any): void {
    const nuevoRol = user.role === 'admin' ? 'user' : 'admin';
    const confirmacion = confirm(`¿Estás seguro de cambiar el rol de ${user.fullName} a ${nuevoRol.toUpperCase()}?`);

    if (confirmacion) {
      this.userService.updateUserRole(user.id, nuevoRol).subscribe({
        next: () => {
          this.cargarTodo();
          alert('Rol actualizado correctamente');
        },
        error: (err) => {
          if (err.status === 409) {
            alert('Error: No puedes cambiar tu propio rol por seguridad.');
          } else {
            alert('Error al actualizar el rol');
          }
        }
      });
    }
  }

    // --- MÉTRICAS CALCULADAS PARA EL DASHBOARD ---

    /**
     * Calcula el volumen total de Time Credits movidos en la plataforma
     */
    get totalVolume(): number {
      if (!this.transactions) return 0;
      return this.transactions.reduce((acc, tx) => acc + tx.amount, 0);
    }

    /**
     * Cuenta cuántas intervenciones de moderación se han registrado
     * (Basado en los logs de 0 TC que contienen la palabra 'MODERATION')
     */
    get moderationInterventions(): number {
      if (!this.transactions) return 0;
      return this.transactions.filter(tx => 
        tx.amount === 0 && tx.concept.toUpperCase().includes('MODERATION')
      ).length;
    }

    /**
     * Calcula la calificación media global de todos los servicios
     */
    get globalAvgRating(): number {
      if (!this.reviews || this.reviews.length === 0) return 0;
      const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
      return sum / this.reviews.length;
    }

    exportarUsuarios(): void {
    if (this.users.length === 0) return;

    // 1. Cabeceras
    const headers = ['ID', 'Full Name', 'Email', 'Role', 'Balance', 'Status'];
    
    // 2. Mapear datos asegurando comillas para evitar que los espacios rompan las columnas
    const rows = this.users.map(user => [
      `"${user.id || ''}"`,
      `"${user.fullName || ''}"`,
      `"${user.email || ''}"`,
      `"${user.role || ''}"`,
      user.balance || 0,
      `"${user.isActive ? 'Active' : 'Blocked'}"`
    ]);

    // 3. Crear contenido con BOM (para acentos) y separador de punto y coma
    // El \ufeff es el "Byte Order Mark" para que Excel abra el archivo con codificación UTF-8 correctamente
    const csvContent = '\ufeff' + [
      headers.join(';'), 
      ...rows.map(e => e.join(';'))
    ].join('\n');

    // 4. Descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `time_bank_users_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}