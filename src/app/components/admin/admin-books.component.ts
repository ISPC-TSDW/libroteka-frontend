import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Author {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Editorial {
  id: number;
  name: string;
}

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

  constructor(private fb: FormBuilder) {
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
    // TODO: Implement API call
    // For now, using mock data
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

  loadRelatedData(): void {
    // TODO: Implement API calls
    // Mock data for now
    this.authors = [
      { id: 1, name: 'Gabriel García Márquez' }
    ];
    this.genres = [
      { id: 1, name: 'Ficción' }
    ];
    this.editorials = [
      { id: 2, name: 'Editorial Sudamericana' }
    ];
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
        // TODO: Implement update API call
        const updatedBook = { ...this.bookForm.value, id_Book: this.selectedBook.id_Book };
        this.books = this.books.map(book => 
          book.id_Book === this.selectedBook?.id_Book ? updatedBook : book
        );
        alert('Book updated successfully');
      } else {
        // TODO: Implement create API call
        const newBook = { ...this.bookForm.value, id_Book: this.books.length + 1 };
        this.books = [...this.books, newBook];
        alert('Book created successfully');
      }
      this.resetForm();
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
      // TODO: Implement delete API call
      this.books = this.books.filter(b => b.id_Book !== book.id_Book);
      alert('Book deleted successfully');
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedBook = null;
    this.selectedImage = null;
    this.imagePreview = null;
    this.bookForm.reset();
  }
} 