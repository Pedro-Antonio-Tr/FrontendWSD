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
  /**
   * FORMULARIO DE REGISTRO:
   * Definimos los campos necesarios para dar de alta a un usuario.
   * Agregamos validaciones: nombre mínimo 3 caracteres, email válido y password mínimo 6.
   */
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
      // VALIDACIÓN LÓGICA: Comprobamos que las dos contraseñas escritas sean iguales
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, revísalas.');
        return; // Detenemos la ejecución si no coinciden
      }
      
      const formValues = this.registerForm.value;

      /**
       * ADAPTACIÓN DE DATOS (MAPPING):
       * El formulario usa 'name', pero el backend espera 'fullName'. 
       * Creamos un objeto intermedio para que la API lo entienda perfectamente.
       */
      const userDataForBackend = {
        fullName: formValues.name,
        email: formValues.email,
        password: formValues.password
      };

      // Llamada al servicio para persistir el nuevo usuario en la base de datos
      this.authService.register(userDataForBackend).subscribe({
        next: (response) => {
          console.log('Registration successful!', response);
          alert('Account created successfully! You can now log in.');
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error('Error during registration', err);
          alert('There was a problem creating the account. Please try again.');
        }
      });

    } else {
      // Si el usuario intenta enviar el formulario vacío, resaltamos los errores
      this.registerForm.markAllAsTouched();
    }
  }
}