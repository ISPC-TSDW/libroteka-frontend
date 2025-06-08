import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  // styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.clearCart();
    localStorage.removeItem('cartItems');
    localStorage.removeItem('addressDetails');
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('preferenceId');
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 2000);
  }
}