import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user'; 
import { CommonModule } from '@angular/common';
import { ServiceMarketplaceService } from '../../../core/services/service.service';
import { RequestService } from '../../../core/services/request.service';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  activeTab: 'users' | 'services' | 'requests' | 'transactions' = 'users';

  users: any[] = [];
  services: any[] = [];
  requests: any[] = [];
  transactions: any[] = [];

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
    private transactionService: TransactionService
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
        this.stats.totalExchanges = data.filter(r => r.status === 'COMPLETED').length;
      }
    });

    this.transactionService.getAllTransactions().subscribe({
      next: (data) => this.transactions = data
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
}