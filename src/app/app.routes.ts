import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { HomeComponent } from './features/home/home'; 
import { UserProfile } from './features/profile/user-profile/user-profile';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { MarketplaceComponent } from './features/marketplace/marketplace';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [guestGuard] }, 
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  
  { 
    path: 'marketplace', 
    component: MarketplaceComponent,
    canActivate: [authGuard] 
  },

  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard, roleGuard] },
  { path: '**', redirectTo: '' }
];