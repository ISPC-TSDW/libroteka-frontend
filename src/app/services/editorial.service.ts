import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Editorial {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class EditorialService {
  private apiUrl = '/api/editorials';

  constructor(private http: HttpClient) {}

  getEditorials(): Observable<Editorial[]> {
    return this.http.get<Editorial[]>(this.apiUrl);
  }

  createEditorial(editorial: { name: string }): Observable<Editorial> {
    return this.http.post<Editorial>(this.apiUrl, editorial);
  }

  updateEditorial(id: number, editorial: { name: string }): Observable<Editorial> {
    return this.http.put<Editorial>(`${this.apiUrl}/${id}`, editorial);
  }

  deleteEditorial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
