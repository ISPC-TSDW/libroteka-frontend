import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { BusquedaService } from '../../../services/busqueda.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Book } from '../../../models/book.model';
import { BookDetailsComponent } from '../../book-details/book-details.component';

declare var lucide: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BookDetailsComponent],
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
  isMobileMenuOpen: boolean = false;
  searchQuery: string = '';
  searchResults: Book[] = [];
  isSearching: boolean = false;
  selectedBook: Book | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private busquedaService: BusquedaService,
    private router: Router
  ) {
    // Configurar el debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de la última tecla
      distinctUntilChanged(), // Solo emitir si el valor cambió
      switchMap(query => {
        if (query.trim().length > 0) {
          this.isSearching = true;
          return this.busquedaService.getBooksByTitle(query);
        } else {
          this.searchResults = [];
          this.isSearching = false;
          return [];
        }
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.isSearching = false;
        this.searchResults = [];
      }
    });
  }

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

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  selectBook(book: Book): void {
    this.selectedBook = book;
    this.searchQuery = '';
    this.searchResults = [];
  }

  closeBookDetails(): void {
    this.selectedBook = null;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
    this.isCartVisible = false;
  }

  proceedToCheckout(): void {
    this.router.navigate(['/pagos']);
    this.isCartVisible = false;
  }

  showCartDropdown(): void {
    clearTimeout(this.cartDropdownTimeout);
    this.isCartVisible = true;
  }

  hideCartDropdown(): void {
    this.cartDropdownTimeout = setTimeout(() => {
      this.isCartVisible = false;
    }, 150);
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
    if (this.isCartVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}





