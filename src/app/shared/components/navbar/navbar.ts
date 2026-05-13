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
  // Uso de la función inject() para inyección de dependencias
  private authService = inject(AuthService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  
  userBalance = 0; // Almacena el saldo que se mostrará en la barra superior
  isRecharging = false;

  // Getters para controlar qué botones se ven según el estado del usuario
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout(); // Limpia token y saldo
    this.router.navigate(['/']); 
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      /**
       * REACTIVIDAD: Nos suscribimos al observable de saldo del AuthService.
       * Si el saldo cambia en el Perfil o tras un pago, la Navbar se actualiza
       * automáticamente sin refrescar la página.
       */
      this.authService.currentBalance$.subscribe(balance => {
        if (balance !== null) {
          this.userBalance = balance;
        }
      });
      
      // Forzamos una carga inicial del perfil para obtener el saldo actual
      this.authService.getProfile().subscribe();
    }
  }

  /**
   * ACCESO RÁPIDO A PAGOS: Permite iniciar una recarga de Stripe desde cualquier página.
   */
  rechargeBalance(amount: number): void {
    this.isRecharging = true;
    this.paymentService.createCheckoutSession(amount).subscribe({
      next: (response) => {
        // Redirección externa a la pasarela segura de Stripe
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