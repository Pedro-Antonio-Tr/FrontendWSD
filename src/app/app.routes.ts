import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { UserProfile } from './features/profile/user-profile/user-profile';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

// Importamos los guards que acabas de crear
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Ruta protegida: Solo para usuarios logueados (rol estándar o admin)
  { 
    path: 'profile', 
    component: UserProfile,
    canActivate: [authGuard] 
  },
  
  // Ruta protegida: Solo para el rol de Administrador con permisos globales
  { 
    path: 'admin', 
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard] 
  },
  
  // Redirecciones por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];