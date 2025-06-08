import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { ActivatedRoute } from '@angular/router';
import { AuthorService, Author } from '../../services/author.service';
import { GenreService, Genre } from '../../services/genre.service';
import { EditorialService, Editorial } from '../../services/editorial.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  
  @Input() selectedBook: Book | null = null;
  @Output() close = new EventEmitter<void>();
  
  authors: Author[] = [];
  genres: Genre[] = [];
  editorials: Editorial[] = [];

  constructor(
    private authorService: AuthorService,
    private genreService: GenreService,
    private editorialService: EditorialService
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
}