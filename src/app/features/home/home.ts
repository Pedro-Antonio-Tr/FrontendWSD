import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <-- Añadir esto

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // <-- Y meterlo aquí
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent { }