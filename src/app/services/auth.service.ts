import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string | null>(null);

  isLoggedIn = this.loggedIn.asObservable();
  currentUserEmail = this.userEmail.asObservable();

  login(email: string): void {
    sessionStorage.setItem('token', 'token123'); // Store token
    sessionStorage.setItem('userEmail', email); // Store email
    this.loggedIn.next(true);
    this.userEmail.next(email);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    this.loggedIn.next(false);
    this.userEmail.next(null);
  }

  checkLoginStatus(): void {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('userEmail');
    if (token && email) {
      this.loggedIn.next(true);
      this.userEmail.next(email);
    } else {
      this.loggedIn.next(false);
      this.userEmail.next(null);
    }
  }
}