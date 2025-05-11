import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userDetailsKey = 'userDetails';
  private userRoleKey = 'userRole';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserEmailSubject = new BehaviorSubject<string | null>(null);
  private userDetailsSubject = new BehaviorSubject<any>(null);
  private userRoleSubject = new BehaviorSubject<number | null>(null);


  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.accessTokenKey, accessToken);
    sessionStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedInSubject.next(true);
    const email = this.decodeToken(accessToken)?.email || null;
    this.currentUserEmailSubject.next(email);
  }

  storeUserDetails(userDetails: any): void {
    sessionStorage.setItem(this.userDetailsKey, JSON.stringify(userDetails));
    this.userDetailsSubject.next(userDetails);
    
    if (userDetails && userDetails.user && userDetails.user.role !== undefined) {
      sessionStorage.setItem(this.userRoleKey, userDetails.user.role.toString());
      this.userRoleSubject.next(userDetails.user.role);
    } else if (userDetails && userDetails.role !== undefined) {
      sessionStorage.setItem(this.userRoleKey, userDetails.role.toString());
      this.userRoleSubject.next(userDetails.role);
    }
  }
  
  getUserRole(): Observable<number | null> {
    return this.userRoleSubject.asObservable();
  }
  
  hasRole(role: number): boolean {
    const userRoleStr = sessionStorage.getItem(this.userRoleKey);
    return userRoleStr === role.toString();
  }

  getUserDetails(): Observable<any> {
    return this.userDetailsSubject.asObservable();
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
    sessionStorage.removeItem(this.userDetailsKey);
    this.isLoggedInSubject.next(false);
    this.currentUserEmailSubject.next(null);
    this.userDetailsSubject.next(null);
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
      
      // Load stored user details if available
      const userDetailsStr = sessionStorage.getItem(this.userDetailsKey);
      if (userDetailsStr) {
        try {
          const userDetails = JSON.parse(userDetailsStr);
          this.userDetailsSubject.next(userDetails);
          
          // Also load the role
          if (userDetails && userDetails.role !== undefined) {
            this.userRoleSubject.next(userDetails.role);
          }
        } catch (e) {
          console.error('Error parsing stored user details', e);
        }
      }
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