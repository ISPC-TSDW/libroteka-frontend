import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    private apiUrl = `${environment.apiUrl}/api/login/`;

    constructor(private http: HttpClient) { }

    registerUser(user: any): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    getUserDetails(email: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl, { email, password });
    }
}