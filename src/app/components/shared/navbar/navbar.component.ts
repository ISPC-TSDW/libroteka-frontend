import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, Book } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  cartItems: Book[] = [];
  isCartVisible: boolean = false;
  isLoggedIn = false;
  userEmail: string | null = '';

  constructor(
    private cartService: CartService,  
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      this.cartItems = cartItems;
    });
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.currentUserEmail.subscribe(email => {
      this.userEmail = email;
    });

    this.authService.checkLoginStatus();
  }
  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/pagos']);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
