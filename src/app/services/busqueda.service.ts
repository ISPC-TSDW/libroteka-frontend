import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  private apiUrl = 'http://localhost:8000/book/';

  constructor(private http: HttpClient) { }

  searchBooks(criterio: string, value: string): Observable<Book[]> {
    const url = `${this.apiUrl}buscar-libros/?criterio=${criterio}&value=${value}`;
    return this.http.get<Book[]>(url).pipe(
      catchError(error => {
        console.error('Error during search:', error);
        throw error;
      })
    );
  }

  // Métodos específicos para cada criterio de búsqueda
  getBooksByAuthor(author: string): Observable<Book[]> {
    return this.searchBooks('author', author);
  }

  getBooksByTitle(title: string): Observable<Book[]> {
    return this.searchBooks('title', title);
  }

  getBooksByGenre(genre: string): Observable<Book[]> {
    return this.searchBooks('genre', genre);
  }

  getBooksByEditorial(editorial: string): Observable<Book[]> {
    return this.searchBooks('editorial', editorial);
  }
  
}
