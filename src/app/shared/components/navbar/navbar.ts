import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; // Tu servicio

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  // Inyectamos el servicio y el enrutador de forma moderna
  private authService = inject(AuthService);
  private router = inject(Router);
  userBalance = 0;

  // Usamos un 'getter'. Así el HTML preguntará en tiempo real si el usuario está logueado
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // La función real para cerrar sesión
  logout() {
    this.authService.logout(); // Borra el token
    this.router.navigate(['/']); // Te redirije a la pantalla de inicio 
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.authService.getProfile().subscribe(user => this.userBalance = user.balance);
    }
  }
}