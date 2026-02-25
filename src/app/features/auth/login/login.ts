import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  // Importante: Necesitamos ReactiveFormsModule para los formularios y RouterLink para los enlaces
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // Creamos el formulario con sus validaciones
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Método que se ejecuta al pulsar el botón de Entrar
  onSubmit() {
    if (this.loginForm.valid) {
      // Si todo está bien, por ahora solo lo mostramos en consola
      // Más adelante, aquí enviaremos los datos al backend de tu compañero
      console.log('Datos del formulario listos para enviar:', this.loginForm.value);
    } else {
      // Si hay errores, marcamos todos los campos como "tocados" para que se pongan en rojo
      this.loginForm.markAllAsTouched();
    }
  }
}