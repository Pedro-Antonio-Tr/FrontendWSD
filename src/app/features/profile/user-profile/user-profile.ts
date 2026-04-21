import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { ServiceMarketplaceService } from '../../../core/services/service.service';
import { RequestService } from '../../../core/services/request.service';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
  userData: any = null;
  myOfferedServices: any[] = [];
  myRequests: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  myHistory: any[] = [];
  
  viewMode: 'active' | 'history' | 'requests' = 'active';

  serviceForm: FormGroup;
  isSubmitting: boolean = false;
  isEditing: boolean = false;
  editingServiceId: string | null = null;
  serviceToDelete: string | null = null;

  constructor(
    private authService: AuthService,
    private marketplaceService: ServiceMarketplaceService,
    private requestService: RequestService,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [10, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDatos();
    } else {
      this.isLoading = false;
    }
  }

  cargarDatos(): void {
    this.authService.getProfile().subscribe({
      next: (data) => this.userData = data,
      error: () => this.errorMessage = 'No se pudieron cargar los datos del perfil.'
    });

    this.marketplaceService.getMyServices().subscribe({
      next: (services) => {
        this.myOfferedServices = services;
        this.checkLoadingCompletion();
      },
      error: (error) => console.error('Error al cargar mis servicios', error)
    });

    this.requestService.getMyRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests;
        this.checkLoadingCompletion();
      },
      error: (error) => console.error('Error al cargar mis peticiones', error)
    });

    this.transactionService.getHistory().subscribe({
      next: (history) => {
        this.myHistory = history;
        this.checkLoadingCompletion();
      },
      error: (error) => console.error('Error al cargar el historial', error)
    });
  }

  private checkLoadingCompletion() {
    if (this.myOfferedServices && this.myRequests && this.myHistory) {
      this.isLoading = false;
    }
  }

  get filteredServices() {
    return this.myOfferedServices.filter(s => s.status === 'active');
  }

  get receivedRequests() {
    return this.myRequests.filter(req => req.provider.id === this.userData?.id);
  }

  get sentRequests() {
    return this.myRequests.filter(req => req.requester.id === this.userData?.id);
  }

  changeRequestStatus(requestId: string, newStatus: string): void {
    if (newStatus === 'COMPLETED') {
      if (!confirm('Are you sure you want to mark this as completed? This will process the payment.')) {
        return;
      }
    }

    this.requestService.updateRequestStatus(requestId, newStatus).subscribe({
      next: () => {
        alert(`Request status updated to ${newStatus}`);
        this.cargarDatos(); // Recargamos para ver los cambios
        // Si se completó, actualizamos el perfil para que el Navbar refresque el saldo
        if (newStatus === 'COMPLETED') {
          this.authService.getProfile().subscribe();
        }
      },
      error: (err) => alert(err.error?.message || 'Error updating status.')
    });
  }

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
    if (this.serviceForm.invalid || !this.editingServiceId) return;
    this.isSubmitting = true;

    this.marketplaceService.updateService(this.editingServiceId, this.serviceForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cargarDatos();
        document.getElementById('closeProfileModalBtn')?.click();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.isSubmitting = false;
        alert('Hubo un error al actualizar el servicio.');
      }
    });
  }

  openDeleteModal(id: string): void {
    this.serviceToDelete = id;
  }

  confirmDelete(): void {
    if (!this.serviceToDelete) return;
    
    this.marketplaceService.deleteService(this.serviceToDelete).subscribe({
      next: () => {
        this.cargarDatos();
        this.serviceToDelete = null;
        document.getElementById('closeProfileDeleteBtn')?.click(); 
      },
      error: (err) => console.error('Error al borrar', err)
    });
  }
}