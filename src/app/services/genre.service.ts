import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Genre {
  id_Genre: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class GenreService {
  private apiUrl = `${environment.apiUrl}/api/genre/`;

  constructor(private http: HttpClient) {}

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }

  createGenre(genre: { name: string }): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, genre, { withCredentials: true });
  }

  updateGenre(id: number, genre: { name: string }): Observable<Genre> {
    return this.http.put<Genre>(`${this.apiUrl}${id}/`, genre, { withCredentials: true });
  }

  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { withCredentials: true });
  }
}
