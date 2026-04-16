import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  userBalance = 0;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/']); 
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      // 1. Nos ponemos los "auriculares": escuchamos los cambios de saldo en tiempo real
      this.authService.currentBalance$.subscribe(balance => {
        // Si hay un saldo válido (no es null), actualizamos el numerito visual
        if (balance !== null) {
          this.userBalance = balance;
        }
      });
      
      // 2. Pedimos los datos al backend la primera vez para que el "megáfono" empiece a gritar
      this.authService.getProfile().subscribe();
    }
  }
}