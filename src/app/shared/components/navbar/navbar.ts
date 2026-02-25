import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // Añadimos RouterLinkActive para que funcione el resaltado de pestañas
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  // Esta variable controla qué enlaces se ven (más adelante la conectaremos al login real)
  isLoggedIn = false; 

  // Esta función se ejecuta al pulsar el botón "Cerrar Sesión"
  logout() {
    console.log('Cerrando sesión...');
    // Aquí irá la lógica para borrar el token JWT
  }
}