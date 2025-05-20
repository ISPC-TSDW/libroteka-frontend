import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart.service';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { Armchair } from 'lucide-angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  // Parte del carrusel
  currentSlide = 0;

  // Parte de los libros
  books: Book[] = [];
  filteredBooks: Book[] = [];
  nuevosLanzamientos: Book[] = [];
  selectedFilter: string = 'todos';
  addedMessages: Map<number, string> = new Map();

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBooks(); // Cuando arranca, trae los libros
  }

  ngAfterViewInit(): void { // Carrusel, cambio cada 5 segundos
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  loadBooks(): void {
  this.bookService.getBooks().subscribe({
    next: (data) => {
      this.books = data;
      this.filteredBooks = data;

      const currentYear = new Date().getFullYear();
      this.nuevosLanzamientos = data.filter((book: any) => book.year >= 2020);
    },
    error: (err) => {
      console.error('Error cargando libros', err);
    }
  });
}

  applyFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === 'todos') {
      this.filteredBooks = this.books;
    } else if (filter === 'mas-vendidos') {
      this.filteredBooks = this.books.filter(book => book.isBestSeller);
    } else if (filter === 'recomendados') {
      this.filteredBooks = this.books.filter(book => book.isRecommended);
    }
  }

  nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length > 0) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      this.currentSlide = (this.currentSlide + 1) % slides.length;
      slides[this.currentSlide].classList.add('active');
      dots[this.currentSlide].classList.add('active');
    }
  }

  prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length > 0) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
      slides[this.currentSlide].classList.add('active');
      dots[this.currentSlide].classList.add('active');
    }
  }

addToCart(book: Book): void {
  this.cartService.addCartItem(book);
  this.addedMessages.set(book.id_Book, `"${book.title}" agregado con éxito`);
  setTimeout(() => {
    this.addedMessages.delete(book.id_Book);
  }, 3000);



}

}