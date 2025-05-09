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

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 1;
  
  // Paginated lists
  paginatedBooks: Book[] = [];
  paginatedAuthors: Author[] = [];
  paginatedGenres: Genre[] = [];
  paginatedEditorials: Editorial[] = [];

  // Track new items
  private newItems = new Set<number>();
  private readonly NEW_ITEM_TIMEOUT = 5000; // 5 seconds

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
    return this.authors.find(a => a.id_Author === authorId)?.name || '';
  }

  getGenreName(genreId: number): string {
    return this.genres.find(g => g.id_Genre === genreId)?.name || '';
  }

  getEditorialName(editorialId: number): string {
    return this.editorials.find(e => e.id_Editorial === editorialId)?.name || '';
  }

  // Pagination methods
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Sort lists alphabetically
    this.books.sort((a, b) => a.title.localeCompare(b.title));
    this.authors.sort((a, b) => a.name.localeCompare(b.name));
    this.genres.sort((a, b) => a.name.localeCompare(b.name));
    this.editorials.sort((a, b) => a.name.localeCompare(b.name));
    
    this.paginatedBooks = this.books.slice(startIndex, endIndex);
    this.paginatedAuthors = this.authors.slice(startIndex, endIndex);
    this.paginatedGenres = this.genres.slice(startIndex, endIndex);
    this.paginatedEditorials = this.editorials.slice(startIndex, endIndex);
    
    this.totalItems = Math.max(
      this.books.length,
      this.authors.length,
      this.genres.length,
      this.editorials.length
    );
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  // Update load methods to use pagination
  loadBooks(): void {
    console.log('AdminBooksComponent.loadBooks() called');
    this.bookService.getBooks().subscribe(
      data => {
        console.log('AdminBooksComponent: Received books data:', data);
        this.books = data;
        this.updatePagination();
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
        this.updatePagination();
      }
    );
  }

  loadRelatedData(): void {
    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
      this.updatePagination();
    });
    this.genreService.getGenres().subscribe(genres => {
      this.genres = genres;
      this.updatePagination();
    });
    this.editorialService.getEditorials().subscribe(editorials => {
      this.editorials = editorials;
      this.updatePagination();
    });
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
      const formValue = this.bookForm.value;
      
      // Convert IDs to numbers
      formValue.id_Author = Number(formValue.id_Author);
      formValue.id_Genre = Number(formValue.id_Genre);
      formValue.id_Editorial = Number(formValue.id_Editorial);
      
      // Append form fields
      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
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
            this.updatePagination();
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
            this.updatePagination();
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
  addAuthor() {
    if (this.newAuthorName.trim()) {
      this.authorService.createAuthor({ name: this.newAuthorName.trim() }).subscribe(author => {
        this.authors.unshift(author);
        this.newItems.add(author.id_Author);
        this.updatePagination();
        this.newAuthorName = ''; // Clear the input
        // Remove "new" status after timeout
        setTimeout(() => {
          this.newItems.delete(author.id_Author);
        }, this.NEW_ITEM_TIMEOUT);
      });
    }
  }
  updateAuthor(id: number, name: string) {
    this.authorService.updateAuthor(id, { name }).subscribe(updated => {
      const idx = this.authors.findIndex(a => a.id_Author === id);
      if (idx > -1) this.authors[idx] = updated;
    });
  }
  deleteAuthor(id: number) {
    if (confirm('Are you sure you want to delete this author?')) {
      this.authorService.deleteAuthor(id).subscribe({
        next: () => {
          this.authors = this.authors.filter(a => a.id_Author !== id);
          this.newItems.delete(id);
          this.updatePagination();
        },
        error: (error) => {
          console.error('Error deleting author:', error);
          alert('Error deleting author. Please try again.');
        }
      });
    }
  }

  // Genre CRUD
  addGenre() {
    if (this.newGenreName.trim()) {
      this.genreService.createGenre({ name: this.newGenreName.trim() }).subscribe(genre => {
        this.genres.unshift(genre);
        this.newItems.add(genre.id_Genre);
        this.updatePagination();
        this.newGenreName = ''; // Clear the input
        setTimeout(() => {
          this.newItems.delete(genre.id_Genre);
        }, this.NEW_ITEM_TIMEOUT);
      });
    }
  }
  updateGenre(id: number, name: string) {
    this.genreService.updateGenre(id, { name }).subscribe(updated => {
      const idx = this.genres.findIndex(g => g.id_Genre === id);
      if (idx > -1) this.genres[idx] = updated;
    });
  }
  deleteGenre(id: number) {
    if (confirm('Are you sure you want to delete this genre?')) {
      this.genreService.deleteGenre(id).subscribe({
        next: () => {
          this.genres = this.genres.filter(g => g.id_Genre !== id);
          this.newItems.delete(id);
          this.updatePagination();
        },
        error: (error) => {
          console.error('Error deleting genre:', error);
          alert('Error deleting genre. Please try again.');
        }
      });
    }
  }

  // Editorial CRUD
  addEditorial() {
    if (this.newEditorialName.trim()) {
      this.editorialService.createEditorial({ name: this.newEditorialName.trim() }).subscribe(editorial => {
        this.editorials.unshift(editorial);
        this.newItems.add(editorial.id_Editorial);
        this.updatePagination();
        this.newEditorialName = ''; // Clear the input
        setTimeout(() => {
          this.newItems.delete(editorial.id_Editorial);
        }, this.NEW_ITEM_TIMEOUT);
      });
    }
  }
  updateEditorial(id: number, name: string) {
    this.editorialService.updateEditorial(id, { name }).subscribe(updated => {
      const idx = this.editorials.findIndex(e => e.id_Editorial === id);
      if (idx > -1) this.editorials[idx] = updated;
    });
  }
  deleteEditorial(id: number) {
    if (confirm('Are you sure you want to delete this editorial?')) {
      this.editorialService.deleteEditorial(id).subscribe({
        next: () => {
          this.editorials = this.editorials.filter(e => e.id_Editorial !== id);
          this.newItems.delete(id);
          this.updatePagination();
        },
        error: (error) => {
          console.error('Error deleting editorial:', error);
          alert('Error deleting editorial. Please try again.');
        }
      });
    }
  }

  // Helper method to check if an item is new
  isNewItem(item: Author | Genre | Editorial): boolean {
    if ('id_Author' in item) return this.newItems.has(item.id_Author);
    if ('id_Genre' in item) return this.newItems.has(item.id_Genre);
    if ('id_Editorial' in item) return this.newItems.has(item.id_Editorial);
    return false;
  }
} 