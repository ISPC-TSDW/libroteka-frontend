import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { AuthorService } from '../../services/author.service';
import { GenreService } from '../../services/genre.service';
import { EditorialService } from '../../services/editorial.service';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {
  favoritos: Book[] = [];

  authors: any[] = [];
  genres: any[] = [];
  editorials: any[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private bookService: BookService,
    private authorService: AuthorService,
    private genreService: GenreService,
    private editorialService: EditorialService
  ) {}

  ngOnInit(): void {
    this.loadRelatedData();
    this.loadFavorites();
  }

  loadRelatedData(): void {
    this.authorService.getAuthors().subscribe(data => this.authors = data);
    this.genreService.getGenres().subscribe(data => this.genres = data);
    this.editorialService.getEditorials().subscribe(data => this.editorials = data);
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        const bookIds = data.map((fav: any) => fav.id_book);

        this.bookService.getBooks().subscribe((books: Book[]) => {
          this.favoritos = books.filter(book => bookIds.includes(book.id_Book));
        });
      },
      error: (err) => {
        console.error('Error al cargar favoritos:', err);
      }
    });
  }

  getAuthorName(id: number): string {
    return this.authors.find(a => a.id_Author === id)?.name || 'Desconocido';
  }

  getGenreName(id: number): string {
    return this.genres.find(g => g.id_Genre === id)?.name || 'Desconocido';
  }

  getEditorialName(id: number): string {
    return this.editorials.find(e => e.id_Editorial === id)?.name || 'Desconocida';
  }
}