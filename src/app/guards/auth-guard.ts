import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuardsService } from '../services/auth-guards.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authGuardsService = inject(AuthGuardsService);
  const router = inject(Router);
  if(authGuardsService.isAuth()){
    return true;
  } else{
    router.navigateByUrl('/login');
    return false;
  }
  return authGuardsService.isAuth();
};
