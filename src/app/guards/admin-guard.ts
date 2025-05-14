// guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if user has admin role (role=2)
    if (this.authService.hasRole(2)) {
      return true;
    } else {
      // Redirect non-admin users to dashboard
      this.router.navigate(['/dashboard']);
      console.log('Access denied: Admin role required');
      return false;
    }
  }
}