import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user'; 
import { CommonModule } from '@angular/common';
import { ServiceMarketplaceService } from '../../../core/services/service.service';
import { RequestService } from '../../../core/services/request.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
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
}