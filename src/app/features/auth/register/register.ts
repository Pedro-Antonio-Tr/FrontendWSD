import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; // Tu servicio

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  // Definimos el formulario y sus validaciones
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registerForm.valid) {
      // 1. Verificamos que las contraseñas sean idénticas
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, revísalas.');
        return; // Detenemos la ejecución aquí si no coinciden
      }
      
      // 2. Quitamos el campo 'confirmPassword' porque al backend no le interesa
      const { confirmPassword, ...userData } = this.registerForm.value;

      // 3. Enviamos los datos al backend a través de nuestro servicio
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('¡Registro exitoso!', response);
          alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']); // Redirigimos al usuario al login
        },
        error: (err) => {
          console.error('Error al registrarse', err);
          alert('Hubo un problema al crear la cuenta. Inténtalo de nuevo.');
        }
      });

    } else {
      // Si el formulario es inválido, mostramos los errores en rojo
      this.registerForm.markAllAsTouched();
    }
  }
}