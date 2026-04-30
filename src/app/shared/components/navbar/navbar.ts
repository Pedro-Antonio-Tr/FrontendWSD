import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 
import { PaymentService } from '../../../core/services/payment.service'; // <-- Añadido

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  
  userBalance = 0;
  isRecharging = false;

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
      this.authService.currentBalance$.subscribe(balance => {
        if (balance !== null) {
          this.userBalance = balance;
        }
      });
      
      this.authService.getProfile().subscribe();
    }
  }

  // <-- NUEVO: Método para recargar saldo directamente desde la Navbar
  rechargeBalance(amount: number): void {
    this.isRecharging = true;
    this.paymentService.createCheckoutSession(amount).subscribe({
      next: (response) => {
        window.location.href = response.checkoutUrl;
      },
      error: (err) => {
        console.error('Error al iniciar el pago', err);
        alert('Hubo un error al conectar con la pasarela de pago.');
        this.isRecharging = false;
      }
    });
  }
}