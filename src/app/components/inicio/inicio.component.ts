import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  // Parte del carrusel principal
  currentSlide = 0;

  // Parte de los libros
  books: Book[] = [];
  filteredBooks: Book[] = [];
  nuevosLanzamientos: Book[] = [];
  selectedFilter: string = 'todos';
  addedMessages: Map<number, string> = new Map();

  // Modal
  selectedBook: Book | null = null;

  // Referencia al carrusel horizontal de lanzamientos
  @ViewChild('slider') slider!: ElementRef;

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  ngAfterViewInit(): void {
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
        this.nuevosLanzamientos = data.filter((book: any) => book.year >= 1800);
      },
      error: (err) => {
        console.error('Error cargando libros', err);
      }
    });
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

  addToCart(book: Book): void {
    this.cartService.addCartItem(book);
    this.addedMessages.set(book.id_Book, `"${book.title}" agregado con éxito`);
    setTimeout(() => {
      this.addedMessages.delete(book.id_Book);
    }, 3000);
  }

  nextNuevosSlide(): void {
    if (this.slider?.nativeElement) {
      this.slider.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  prevNuevosSlide(): void {
    if (this.slider?.nativeElement) {
      this.slider.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  // abrir modal
  openModal(book: Book): void {
    this.selectedBook = book;
  }

  // cerrar modal
  closeModal(): void {
    this.selectedBook = null;
  }
}
