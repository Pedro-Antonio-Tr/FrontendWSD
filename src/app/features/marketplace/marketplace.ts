import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ServiceMarketplaceService } from '../../core/services/service.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css']
})
export class MarketplaceComponent implements OnInit {
  services: any[] = [];
  isLoading: boolean = true;
  
  // Variables para el formulario
  serviceForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private marketplaceService: ServiceMarketplaceService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [10, [Validators.required, Validators.min(1)]] // Por defecto cuesta 10 créditos
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.marketplaceService.getAllActiveServices().subscribe({
      next: (data) => {
        this.services = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando los servicios:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    this.marketplaceService.createService(this.serviceForm.value).subscribe({
      next: (response) => {
        console.log('Servicio creado:', response);
        this.isSubmitting = false;
        this.serviceForm.reset({ price: 10 }); 
        
        // Recargamos la lista para que aparezca el nuevo servicio al instante
        this.cargarServicios();
        
        document.getElementById('closeModalBtn')?.click();
      },
      error: (err) => {
        console.error('Error al crear el servicio', err);
        this.isSubmitting = false;
        alert('Hubo un error al publicar el servicio.');
      }
    });
  }
}