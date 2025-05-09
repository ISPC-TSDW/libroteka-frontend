import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Author {
  id_Author: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/api/authors/`;

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  createAuthor(author: { name: string }): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  updateAuthor(id: number, author: { name: string }): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}${id}/`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
