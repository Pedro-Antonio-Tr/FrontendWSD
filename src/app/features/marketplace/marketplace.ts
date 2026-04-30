import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ServiceMarketplaceService } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth';
import { RequestService } from '../../core/services/request.service';
import { ReviewService } from '../../core/services/review.service';

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

  currentBalance: number = 0;
  serviceToBuy: any = null;
  isBuying: boolean = false;

  serviceForm: FormGroup;
  isSubmitting: boolean = false;
  isEditing: boolean = false;
  editingServiceId: string | null = null;
  serviceToDelete: string | null = null;
  filterForm: FormGroup;
  
  serviceRatingMap: { [serviceId: string]: { avg: number, count: number, reviews: any[] } } = {};
  providerRatingMap: { [providerId: string]: { totalRating: number, count: number, avg: number } } = {};
  selectedServiceForReviews: any = null; 
  
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  } 

  constructor(
    private marketplaceService: ServiceMarketplaceService,
    private authService: AuthService,
    private requestService: RequestService,
    private reviewService: ReviewService,
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
      error: (err) => console.error('Error al obtener el ID del usuario', err)
    });
  }

  cargarServicios(): void {
    this.isLoading = true;
    const currentFilters = this.filterForm.value;

    this.marketplaceService.getAllActiveServices(currentFilters).subscribe({
      next: (data) => {
        this.services = data;
        this.isLoading = false;
        
        this.providerRatingMap = {}; 
        
        this.services.forEach(service => {
          this.reviewService.getServiceReviews(service.id).subscribe(reviews => {
            
            const avg = reviews.length ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length : 0;
            this.serviceRatingMap[service.id] = { avg, count: reviews.length, reviews };

            const provId = service.provider.id;
            if (!this.providerRatingMap[provId]) {
              this.providerRatingMap[provId] = { totalRating: 0, count: 0, avg: 0 };
            }
            this.providerRatingMap[provId].totalRating += reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
            this.providerRatingMap[provId].count += reviews.length;
            this.providerRatingMap[provId].avg = this.providerRatingMap[provId].count ? 
                (this.providerRatingMap[provId].totalRating / this.providerRatingMap[provId].count) : 0;
          });
        });
      },
      error: (err) => {
        console.error('Error cargando los servicios:', err);
        this.isLoading = false;
      }
    });
  }

  openReviewsModal(service: any): void {
    this.selectedServiceForReviews = service;
  }

  openBuyModal(service: any): void {
    this.serviceToBuy = service;
  }

  confirmRequest(): void {
    if (!this.serviceToBuy) return;
    this.isBuying = true;

    this.requestService.createRequest(this.serviceToBuy.id).subscribe({
      next: () => {
        this.isBuying = false;
        alert('¡Petición enviada! El proveedor debe aceptarla.');
        document.getElementById('closeBuyModalBtn')?.click();
        this.cargarServicios(); 
      },
      error: (err) => {
        this.isBuying = false;
        alert(err.error?.message || 'Error al enviar la petición.');
      }
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

  resetFilters(): void {
    this.filterForm.reset();
    this.cargarServicios();
  }
}