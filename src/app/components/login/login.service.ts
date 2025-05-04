import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl =  `${environment.apiUrl}/api/token/`;

  constructor(private http: HttpClient) {}

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}