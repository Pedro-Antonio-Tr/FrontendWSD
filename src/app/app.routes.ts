import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { HomeComponent } from './features/home/home'; 
import { UserProfile } from './features/profile/user-profile/user-profile';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

// Importamos los guards
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent }, 
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
  
  // Ahora, si alguien mete una URL que no existe, le mandamos a la pantalla de inicio
  { path: '**', redirectTo: '' }
];