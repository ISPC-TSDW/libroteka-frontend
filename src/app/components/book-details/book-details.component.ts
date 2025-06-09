import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book.model';
import { AuthorService, Author } from '../../services/author.service';
import { GenreService, Genre } from '../../services/genre.service';
import { EditorialService, Editorial } from '../../services/editorial.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  
  @Input() selectedBook: Book | null = null;
  @Output() close = new EventEmitter<void>();
  
  authors: Author[] = [];
  genres: Genre[] = [];
  editorials: Editorial[] = [];
  quantity: number = 1;

  constructor(
    private authorService: AuthorService,
    private genreService: GenreService,
    private editorialService: EditorialService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadRelatedData();
  }

  loadRelatedData() {
    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
    });
    this.genreService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
    this.editorialService.getEditorials().subscribe(editorials => {
      this.editorials = editorials;
    });
  }

  getAuthorName(author: Author | number | null): string {
    if (!author) return 'Autor desconocido';
    if (typeof author === 'object' && 'name' in author) return author.name;
    return this.authors.find(a => a.id_Author === author)?.name || 'Autor desconocido';
  }

  getGenreName(genre: Genre | number | null): string {
    if (!genre) return 'Género desconocido';
    if (typeof genre === 'object' && 'name' in genre) return genre.name;
    return this.genres.find(g => g.id_Genre === genre)?.name || 'Género desconocido';
  }

  getEditorialName(editorial: Editorial | number | null): string {
    if (!editorial) return 'Editorial desconocida';
    if (typeof editorial === 'object' && 'name' in editorial) return editorial.name;
    return this.editorials.find(e => e.id_Editorial === editorial)?.name || 'Editorial desconocida';
  }
  
  closePopup() {
    this.close.emit();
  }

  addToCart() {
    if (this.selectedBook) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addCartItem(this.selectedBook);
      }
    }
  }
}