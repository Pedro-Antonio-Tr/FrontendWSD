import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  /**
   * FORMULARIO REACTIVO: Definimos la estructura del formulario y sus reglas.
   * - email: Obligatorio y con formato de correo válido.
   * - password: Obligatorio y con un mínimo de 6 caracteres.
   */
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * PROCESO DE AUTENTICACIÓN:
   * Se dispara al pulsar el botón de "Login".
   */
  onSubmit() {
    if (this.loginForm.valid) {
      // Si el formulario cumple las validaciones de arriba, llamamos al servicio
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('¡Login exitoso!', response);
          // Redirigimos al inicio (Home/Marketplace) tras obtener el token
          this.router.navigate(['/']); 
        },
        error: (err) => {
          console.error('Error al iniciar sesión', err);
          
          const mensajeBackend = err.error?.message;

          // Si no hay mensaje específico, usamos el genérico.
          if (mensajeBackend) {
            alert(mensajeBackend); 
          } else {
            alert('Ups... Correo o contraseña incorrectos. ¡Inténtalo de nuevo!');
          }
        }
      });
    } else {
      // Si el formulario es inválido (campos vacíos), marcamos todo como 'touched'
      // para que el HTML muestre los errores en rojo automáticamente.
      this.loginForm.markAllAsTouched();
    }
  }
}