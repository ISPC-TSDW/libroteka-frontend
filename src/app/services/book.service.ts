import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/api/book/`;

  constructor(private http: HttpClient) {
    console.log('BookService initialized with URL:', this.apiUrl);
  }

  getBooks(): Observable<any> {
    console.log('BookService.getBooks() called');
    const url = this.apiUrl;
    console.log('Making GET request to:', url);
    return this.http.get(url).pipe(
      tap({
        next: (response) => console.log('BookService.getBooks() response:', response),
        error: (error) => console.error('BookService.getBooks() error:', error)
      }),
      catchError(this.handleError)
    );
  }

  createBook(bookData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, bookData).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(id: number, bookData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, bookData).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('BookService: An error occurred:', error);
    return throwError(() => error);
  }
}