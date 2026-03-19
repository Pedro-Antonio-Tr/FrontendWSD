import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
  userData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        console.log('Datos reales del backend:', data);
        this.userData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil', error);
        this.errorMessage = 'No se pudieron cargar los datos del perfil.';
        this.isLoading = false;
      }
    });
  }
}