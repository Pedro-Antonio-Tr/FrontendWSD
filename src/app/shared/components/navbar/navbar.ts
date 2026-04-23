import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  userBalance = 0;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/']); 
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.authService.currentBalance$.subscribe(balance => {
        if (balance !== null) {
          this.userBalance = balance;
        }
      });
      
      this.authService.getProfile().subscribe();
    }
  }
}