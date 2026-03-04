import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; // Tu servicio

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  // Inyectamos el servicio y el enrutador de forma moderna
  private authService = inject(AuthService);
  private router = inject(Router);

  // Usamos un 'getter'. Así el HTML preguntará en tiempo real si el usuario está logueado
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // La función real para cerrar sesión
  logout() {
    this.authService.logout(); // Borra el token
    this.router.navigate(['/login']); // Te expulsa al login
  }
}