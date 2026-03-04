import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'] 
})
export class UserProfile implements OnInit {
  // Datos simulados (Mock). En el Sprint 2 los pediremos al backend usando el token JWT
  user = {
    name: 'Estudiante WSD',
    email: 'estudiante@uclm.es',
    joinDate: 'Marzo 2026',
    timeCredits: 5 // Este es el saldo vital del Banco de Tiempo
  };

  ngOnInit(): void {
    // Aquí es donde en el futuro llamaremos a un UserService para traer los datos reales
    console.log('Perfil cargado. Listo para mostrar datos.');
  }
}