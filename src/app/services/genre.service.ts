import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Genre {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class GenreService {
  private apiUrl = '/api/genres';

  constructor(private http: HttpClient) {}

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }

  createGenre(genre: { name: string }): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, genre);
  }

  updateGenre(id: number, genre: { name: string }): Observable<Genre> {
    return this.http.put<Genre>(`${this.apiUrl}/${id}`, genre);
  }

  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
