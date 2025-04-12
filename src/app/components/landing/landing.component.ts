import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { CartService, Book } from '../../services/cart.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  books: Book[] = [];
  cartItemCount: number = 0;

  constructor(private bookService: BookService, private cartService: CartService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(
      data => {
        this.books = data as any;
        console.log('Fetched books:', this.books);
      },
      error => {
        console.error('Error fetching books', error);
      }
    );

    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    });
  }

  addCartItem(book: Book): void {
    this.cartService.addCartItem(book);
  }
}
