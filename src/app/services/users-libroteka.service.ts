import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersLibrotekaService {
  private apiUrl = 'http://localhost:8000/api/users/';

  constructor(private http: HttpClient) {}

  registerUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}