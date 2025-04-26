import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsService {
  private accessTokenKey = 'accessToken';

  constructor() {}

  isAuth(): boolean {
    const token = sessionStorage.getItem(this.accessTokenKey);
    return !!token && !this.isTokenExpired(token);
  }

  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; 
    }
    const expiryTime = decoded.exp * 1000;
    return Date.now() > expiryTime;
  }
}