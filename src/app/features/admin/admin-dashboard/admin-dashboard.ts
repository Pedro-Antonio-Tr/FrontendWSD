import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  // Estadísticas generales simuladas
  stats = {
    totalUsers: 24,
    totalServices: 56,
    totalExchanges: 128
  };

  // Lista de usuarios simulada para la tabla
  recentUsers = [
    { id: 1, name: 'Juan Pérez', email: 'juan@uclm.es', status: 'Activo' },
    { id: 2, name: 'Ana Gómez', email: 'ana@uclm.es', status: 'Activo' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@uclm.es', status: 'Bloqueado' }
  ];
}