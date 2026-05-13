import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { HomeComponent } from './features/home/home'; 
import { UserProfile } from './features/profile/user-profile/user-profile';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { MarketplaceComponent } from './features/marketplace/marketplace';

// Importación de los Guards que definen la seguridad
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  // RUTA PÚBLICA / INICIO: Solo para usuarios no logueados (usando guestGuard)
  { path: '', component: HomeComponent, canActivate: [guestGuard] }, 

  // RUTAS DE ACCESO: Protegidas por guestGuard para que si ya estás logueado, no puedas volver aquí
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  
  // RUTA DEL MARKETPLACE: Requiere estar autenticado (authGuard)
  { 
    path: 'marketplace', 
    component: MarketplaceComponent,
    canActivate: [authGuard] 
  },

  // RUTA DE PERFIL: Requiere estar autenticado
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },

  // RUTA DE ADMINISTRACIÓN: Doble capa de seguridad. 
  // 1. Tienes que estar logueado (authGuard).
  // 2. Tienes que ser administrador (roleGuard).
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard, roleGuard] },

  // Si el usuario escribe una ruta que no existe, lo redirigimos a la página principal
  { path: '**', redirectTo: '' }
];