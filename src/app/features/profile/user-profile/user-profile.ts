import { ReviewService } from '../../../core/services/review.service';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { ServiceMarketplaceService } from '../../../core/services/service.service';
import { RequestService } from '../../../core/services/request.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { PaymentService } from '../../../core/services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  reviewsToDisplay: any[] = [];
  isRecharging: boolean = false;
  
  // Variables para el sistema de reviews
  isReviewing = false;
  currentRating = 5;
  reviewComment = '';
  selectedRequest: any = null;
  
  viewMode: any = 'active';

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
    private paymentService: PaymentService,
    private reviewService: ReviewService,
    private route: ActivatedRoute, 
    private router: Router,        
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
      
      this.route.queryParams.subscribe(params => {
        if (params['session_id']) {
          this.paymentService.verifyPayment(params['session_id']).subscribe({
            next: (res) => {
              alert('¡Pago completado! ' + res.message);
              this.router.navigate(['/profile'], { replaceUrl: true });
              this.cargarDatos(); 
            },
            error: (err) => alert('Error verificando el pago')
          });
        } else {
          this.cargarDatos();
        }
      });

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
        // Filtramos las reseñas nada más recibirlas para que el promedio se calcule al inicio
        if (this.myRequests && this.userData) {
          this.reviewsToDisplay = this.myRequests.filter(req => 
            req.provider?.id === this.userData?.id && req.review != null
          );
        }
        
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



  rechargeBalance(amount: number): void {
    this.isRecharging = true;
    this.paymentService.createCheckoutSession(amount).subscribe({
      next: (response) => {
        window.location.href = response.checkoutUrl;
      },
      error: (err) => {
        console.error('Error al iniciar el pago', err);
        alert('Hubo un error al conectar con la pasarela de pago.');
        this.isRecharging = false;
      }
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
  if (!this.userData) return [];
  return this.myRequests.filter(req => req.provider.id === this.userData.id);
  }

  
  get sentRequests() {
    if (!this.userData) return [];
    return this.myRequests.filter(req => req.requester.id === this.userData.id);
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
        this.cargarDatos();
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

  openReviewModal(request: any) {
  this.selectedRequest = request;
  this.isReviewing = true;
  this.currentRating = 5; // Valor por defecto
  this.reviewComment = ''; // Limpiamos el comentario anterior
}

  setRating(stars: number) {
    this.currentRating = stars;
  }

  submitReview() {
    if (!this.selectedRequest) return;

    if (this.reviewComment.length < 5) {
      alert('Please write a slightly longer comment (min. 5 characters).');
      return;
    }

    this.reviewService.createReview(this.selectedRequest.id, this.currentRating, this.reviewComment).subscribe({
      next: () => {
        alert('⭐ Review saved successfully!');
        this.isReviewing = false;
        this.selectedRequest = null;
        this.cargarDatos(); // Esto refresca la lista y hará que el botón cambie a "Already Rated"
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error saving review');
      }
    });
  }

   /**
   * Cambia la vista a reseñas recibidas y filtra los datos
   */
  seleccionarModoReviews(): void {
    this.viewMode = 'received_reviews';
    
    if (!this.myRequests || !this.userData) {
      this.reviewsToDisplay = [];
      return;
    }

    // Filtramos las peticiones: 
    // Que yo sea el proveedor y que la petición tenga una reseña completada
    this.reviewsToDisplay = this.myRequests.filter(req => 
      req.provider?.id === this.userData?.id && req.review != null
    );
  }

  get averageRating(): number {
    if (!this.reviewsToDisplay || this.reviewsToDisplay.length === 0) {
      return 0;
    }
    const total = this.reviewsToDisplay.reduce((sum, req) => sum + (req.review?.rating || 0), 0);
    return total / this.reviewsToDisplay.length;
  }
}