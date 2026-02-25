import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importamos el enrutador y tu componente de la barra de navegación
  imports: [RouterOutlet, Navbar], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Time Bank';
}