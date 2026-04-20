import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ServiceMarketplaceService } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth';
import { RequestService } from '../../core/services/request.service';

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
  currentUserId: string | null = null;
  
  // --- VARIABLES PARA EL SALDO Y COMPRA ---
  currentBalance: number = 0;
  serviceToBuy: any = null;
  isBuying: boolean = false;

  serviceForm: FormGroup;
  isSubmitting: boolean = false;
  isEditing: boolean = false;
  editingServiceId: string | null = null;
  serviceToDelete: string | null = null;
  filterForm: FormGroup;

  constructor(
    private marketplaceService: ServiceMarketplaceService,
    private authService: AuthService,
    private requestService: RequestService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [10, [Validators.required, Validators.min(1)]]
    });
    this.filterForm = this.fb.group({
      search: [''],
      maxPrice: [null]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarUsuarioActual();
      this.cargarServicios();
      
      // Escuchamos el saldo en tiempo real para usarlo en el modal de compra
      this.authService.currentBalance$.subscribe(balance => {
        if (balance !== null) {
          this.currentBalance = balance;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  cargarUsuarioActual(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUserId = user.id; 
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario', err);
      }
    });
  }

  cargarServicios(): void {
    this.isLoading = true;
    
    const currentFilters = this.filterForm.value;

    this.marketplaceService.getAllActiveServices(currentFilters).subscribe({
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

  // --- LÓGICA DE COMPRA ---
  openBuyModal(service: any): void {
    this.serviceToBuy = service;
  }

confirmRequest(): void {
    if (!this.serviceToBuy) return;
    this.isBuying = true;

    // Ahora solo enviamos el ID del servicio. El backend ya sabe quiénes somos gracias al Token.
    this.requestService.createRequest(this.serviceToBuy.id).subscribe({
      next: () => {
        this.isBuying = false;
        // ¡Mensaje cambiado!
        alert('¡Petición enviada! El proveedor debe aceptarla.');

        // Cerramos el modal
        document.getElementById('closeBuyModalBtn')?.click();

        // Recargamos los servicios
        this.cargarServicios(); 
      },
      error: (err) => {
        this.isBuying = false;
        alert(err.error?.message || 'Error al enviar la petición.');
      }
    });
  }

  // --- LÓGICA DE GESTIÓN PROPIA (EDITAR / BORRAR) ---
  openEditModal(service: any): void {
    this.isEditing = true;
    this.editingServiceId = service.id;
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      price: service.price
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingServiceId = null;
    this.serviceForm.reset({ price: 10 });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.isEditing && this.editingServiceId) {
      this.marketplaceService.updateService(this.editingServiceId, this.serviceForm.value).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
    } else {
      this.marketplaceService.createService(this.serviceForm.value).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
    }
  }

  onDeleteService(id: string): void {
    if (confirm('Are you sure you want to cancel this service? This action is permanent.')) {
      this.marketplaceService.deleteService(id).subscribe({
        next: () => this.cargarServicios(),
        error: (err) => console.error('Error deleting service', err)
      });
    }
  }

  private handleSuccess() {
    this.isSubmitting = false;
    this.cargarServicios();
    document.getElementById('closeModalBtn')?.click();
    this.resetForm();
  }

  private handleError() {
    this.isSubmitting = false;
    alert('An error occurred.');
  }

  openDeleteModal(id: string): void {
    this.serviceToDelete = id;
  }

  confirmDelete(): void {
    if (!this.serviceToDelete) return;
    
    this.marketplaceService.deleteService(this.serviceToDelete).subscribe({
      next: () => {
        this.cargarServicios();
        this.serviceToDelete = null;
        document.getElementById('closeDeleteModalBtn')?.click(); 
      },
      error: (err) => console.error('Error al borrar', err)
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.cargarServicios();
  }
}