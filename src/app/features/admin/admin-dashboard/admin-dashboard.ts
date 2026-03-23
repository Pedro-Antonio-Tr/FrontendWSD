import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  // Estadísticas (por ahora las dejamos fijas o simuladas hasta el Sprint 2)
  stats = {
    totalUsers: 0,
    totalServices: 56,
    totalExchanges: 128
  };

  recentUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Llama al backend para traernos todos los usuarios
  cargarUsuarios(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.recentUsers = users;
        this.stats.totalUsers = users.length; // Actualizamos la estadística real
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  // Ejecuta el PATCH en el backend y recarga la tabla
  cambiarEstado(userId: string): void {
    this.userService.toggleUserStatus(userId).subscribe({
      next: () => {
        // Si todo va bien, volvemos a pedir la lista de usuarios para ver los cambios
        this.cargarUsuarios();
      },
      error: (err) => console.error('Error al cambiar estado', err)
    });
  }
}