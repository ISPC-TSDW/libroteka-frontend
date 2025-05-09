import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { AuthorService, Author } from '../../services/author.service';
import { GenreService, Genre } from '../../services/genre.service';
import { EditorialService, Editorial } from '../../services/editorial.service';

interface Book {
  id_Book?: number;
  id_Author: number;
  id_Genre: number;
  id_Editorial: number;
  avg_rating: number;
  image: string | null;
  title: string;
  description: string;
  price: string;
  stock: number;
  ISBN: string;
  year: number;
}

@Component({
  selector: 'app-admin-books',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {
  books: Book[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  editorials: Editorial[] = [];
  bookForm: FormGroup;
  isEditing = false;
  selectedBook: Book | null = null;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  currentYear: number;

  // For add forms in accordion
  newAuthorName: string = '';
  newGenreName: string = '';
  newEditorialName: string = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private genreService: GenreService,
    private editorialService: EditorialService
  ) {
    this.currentYear = new Date().getFullYear();
    this.bookForm = this.fb.group({
      id_Author: ['', Validators.required],
      id_Genre: ['', Validators.required],
      id_Editorial: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      ISBN: ['', Validators.required],
      year: [this.currentYear, [Validators.required, Validators.min(1800), Validators.max(this.currentYear)]]
    });
  }

  ngOnInit(): void {
    console.log('AdminBooksComponent.ngOnInit() called');
    console.log('BookService instance:', this.bookService);
    this.loadBooks();
    this.loadRelatedData();
  }

  getAuthorName(authorId: number): string {
    return this.authors.find(a => a.id === authorId)?.name || '';
  }

  getGenreName(genreId: number): string {
    return this.genres.find(g => g.id === genreId)?.name || '';
  }

  getEditorialName(editorialId: number): string {
    return this.editorials.find(e => e.id === editorialId)?.name || '';
  }

  loadBooks(): void {
    console.log('AdminBooksComponent.loadBooks() called');
    this.bookService.getBooks().subscribe(
      data => {
        console.log('AdminBooksComponent: Received books data:', data);
        this.books = data;
        console.log('AdminBooksComponent: Updated books array:', this.books);
      },
      error => {
        console.error('AdminBooksComponent: Error fetching books:', error);
        // Keep the mock data as fallback
        this.books = [
          {
            id_Book: 30,
            id_Author: 1,
            id_Genre: 1,
            id_Editorial: 2,
            avg_rating: 0.0,
            image: null,
            title: "Cien años de soledad",
            description: "Una obra maestra de Gabriel García Márquez que sigue la historia de la familia Buendía en el mítico pueblo de Macondo. A través de generaciones, la novela explora temas como la soledad, el amor, la violencia y el poder, envueltos en un realismo mágico que mezcla lo extraordinario con lo cotidiano.",
            price: "29.99",
            stock: 100,
            ISBN: "9780307474728",
            year: 1967
          }
        ];
      }
    );
  }

  loadRelatedData(): void {
    this.authorService.getAuthors().subscribe(authors => this.authors = authors);
    this.genreService.getGenres().subscribe(genres => this.genres = genres);
    this.editorialService.getEditorials().subscribe(editorials => this.editorials = editorials);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formData = new FormData();
      // Append form fields
      Object.keys(this.bookForm.value).forEach(key => {
        formData.append(key, this.bookForm.value[key]);
      });
      
      // Append image if selected
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      if (this.isEditing && this.selectedBook) {
        this.bookService.updateBook(this.selectedBook.id_Book!, formData).subscribe({
          next: (response) => {
            this.books = this.books.map(book => 
              book.id_Book === this.selectedBook?.id_Book ? response : book
            );
            alert('Book updated successfully');
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating book:', error);
            // TODO: Add proper error handling/notification
          }
        });
      } else {
        this.bookService.createBook(formData).subscribe({
          next: (response) => {
            this.books = [...this.books, response];
            alert('Book created successfully');
            this.resetForm();
          },
          error: (error) => {
            console.error('Error creating book:', error);
            // TODO: Add proper error handling/notification
          }
        });
      }
    }
  }

  editBook(book: Book): void {
    this.isEditing = true;
    this.selectedBook = book;
    this.bookForm.patchValue(book);
    this.imagePreview = book.image;
  }

  deleteBook(book: Book): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(book.id_Book!).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id_Book !== book.id_Book);
          alert('Book deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          // TODO: Add proper error handling/notification
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedBook = null;
    this.selectedImage = null;
    this.imagePreview = null;
    this.bookForm.reset();
  }

  // Author CRUD
  addAuthor(name: string) {
    this.authorService.createAuthor({ name }).subscribe(author => this.authors.push(author));
  }
  updateAuthor(id: number, name: string) {
    this.authorService.updateAuthor(id, { name }).subscribe(updated => {
      const idx = this.authors.findIndex(a => a.id === id);
      if (idx > -1) this.authors[idx] = updated;
    });
  }
  deleteAuthor(id: number) {
    this.authorService.deleteAuthor(id).subscribe(() => {
      this.authors = this.authors.filter(a => a.id !== id);
    });
  }

  // Genre CRUD
  addGenre(name: string) {
    this.genreService.createGenre({ name }).subscribe(genre => this.genres.push(genre));
  }
  updateGenre(id: number, name: string) {
    this.genreService.updateGenre(id, { name }).subscribe(updated => {
      const idx = this.genres.findIndex(g => g.id === id);
      if (idx > -1) this.genres[idx] = updated;
    });
  }
  deleteGenre(id: number) {
    this.genreService.deleteGenre(id).subscribe(() => {
      this.genres = this.genres.filter(g => g.id !== id);
    });
  }

  // Editorial CRUD
  addEditorial(name: string) {
    this.editorialService.createEditorial({ name }).subscribe(editorial => this.editorials.push(editorial));
  }
  updateEditorial(id: number, name: string) {
    this.editorialService.updateEditorial(id, { name }).subscribe(updated => {
      const idx = this.editorials.findIndex(e => e.id === id);
      if (idx > -1) this.editorials[idx] = updated;
    });
  }
  deleteEditorial(id: number) {
    this.editorialService.deleteEditorial(id).subscribe(() => {
      this.editorials = this.editorials.filter(e => e.id !== id);
    });
  }
} 