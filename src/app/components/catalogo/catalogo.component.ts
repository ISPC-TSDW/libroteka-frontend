import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { GenreService, Genre } from '../../services/genre.service';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  genres: Genre[] = [];
  selectedCategory: string = 'todo';
  loading: boolean = false;
  private categorySubscription: Subscription;
  private booksLoaded: boolean = false;

  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private categoryService: CategoryService
  ) {
    this.categorySubscription = this.categoryService.selectedCategory$.subscribe(category => {
      if (category && this.booksLoaded) {
        this.filterByCategory(category);
      }
    });
  }

  ngOnInit() {
    this.loadBooks();
    this.loadGenres();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  loadBooks() {
    this.loading = true;
    this.booksLoaded = false;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = books;
        this.loading = false;
        this.booksLoaded = true;
        
        // Una vez que los libros están cargados, aplicamos el filtro si hay una categoría seleccionada
        const savedCategory = this.categoryService.getCategory();
        if (savedCategory) {
          setTimeout(() => {
            this.filterByCategory(savedCategory);
          }, 500); // Esperamos medio segundo para asegurar que todo esté listo
        }
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
        this.loading = false;
      }
    });
  }

  loadGenres() {
    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.loading = true;
    
    if (category === 'todo') {
      this.filteredBooks = this.books;
      this.loading = false;
    } else {
      this.filteredBooks = this.books.filter(book => {
        if (!book.id_Genre) return false;
        
        // Si id_Genre es un objeto (tiene la propiedad name)
        if (typeof book.id_Genre === 'object' && book.id_Genre !== null) {
          return book.id_Genre.name.toLowerCase() === category.toLowerCase();
        }
        
        // Si id_Genre es un número (ID)
        const genreId = Number(book.id_Genre);
        const genre = this.genres.find(g => g.id_Genre === genreId);
        return genre ? genre.name.toLowerCase() === category.toLowerCase() : false;
      });
      this.loading = false;
    }
  }

  getGenreName(genre: Genre | number | null): string {
    if (!genre) return 'Género desconocido';
    if (typeof genre === 'object' && 'name' in genre) return genre.name;
    const genreId = Number(genre);
    const foundGenre = this.genres.find(g => g.id_Genre === genreId);
    return foundGenre ? foundGenre.name : 'Género desconocido';
  }
}
