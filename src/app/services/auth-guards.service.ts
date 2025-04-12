import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsService {
  token = 'token123';

  constructor() {}
  isAuth() {
    const storedToken = sessionStorage.getItem('token'); 
    this.token = storedToken || ''; 
    return this.token.length > 0;
  }
  
}
