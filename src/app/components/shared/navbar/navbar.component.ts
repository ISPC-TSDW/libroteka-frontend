import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

declare var lucide: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, DoCheck {
  cartItemCount: number = 0;
  cartItems: any[] = [];
  isCartVisible: boolean = false;
  cartDropdownTimeout: any;
  isLoggedIn = false;
  userEmail: string | null = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      this.cartItems = cartItems;
    });

    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.currentUserEmail().subscribe(email => {
      this.userEmail = email;
    });

    this.authService.checkLoginStatus();
  }

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  ngDoCheck(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/pagos']);
  }

  showCartDropdown(): void {
    clearTimeout(this.cartDropdownTimeout);
    this.isCartVisible = true;
  }

  hideCartDropdown(): void {
    this.cartDropdownTimeout = setTimeout(() => {
      this.isCartVisible = false;
    }, 150); // pequeño delay para evitar parpadeo si el usuario mueve rápido el mouse
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }
}





