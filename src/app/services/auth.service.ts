import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserEmailSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  storeTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.accessTokenKey, accessToken);
    sessionStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedInSubject.next(true);
    const email = this.decodeToken(accessToken)?.email || null;
    this.currentUserEmailSubject.next(email);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    this.isLoggedInSubject.next(false);
    this.currentUserEmailSubject.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  currentUserEmail(): Observable<string | null> {
    return this.currentUserEmailSubject.asObservable();
  }

  checkLoginStatus(): void {
    const token = this.getAccessToken();
    this.isLoggedInSubject.next(!!token);
    if (token) {
      const email = this.decodeToken(token)?.email || null;
      this.currentUserEmailSubject.next(email);
    }
  }

  logout(): void {
    this.clearTokens();
  }

  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }
}