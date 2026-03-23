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
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('¡Login exitoso!', response);
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
      this.loginForm.markAllAsTouched();
    }
  }
}