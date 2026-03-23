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
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, revísalas.');
        return; 
      }
      
      // 2. Extraemos los valores del formulario
      const formValues = this.registerForm.value;

      // 3. TRADUCCIÓN: Empaquetamos los datos exactamente como los pide el backend (DTO)
      const userDataForBackend = {
        fullName: formValues.name, // Convertimos tu 'name' al 'fullName' del backend
        email: formValues.email,
        password: formValues.password
      };

      // 4. Enviamos los datos adaptados al backend
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
      this.registerForm.markAllAsTouched();
    }
  }
}