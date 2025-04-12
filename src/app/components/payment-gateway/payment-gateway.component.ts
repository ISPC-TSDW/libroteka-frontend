import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService, Book } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {
  addressDetails = {
    city: '',
    address: '',
    telephone: ''
  };

  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  };

  cartItems: Book[] = [];
  totalAmount: number = 0;
  showPaymentForm: boolean = false;

  constructor(private router: Router, private cartService: CartService, private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.totalAmount = this.calculateTotal();
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  onAddressSubmit() {
    this.showPaymentForm = true;
  }

  onPaymentSubmit() {
    this.authService.currentUserEmail.subscribe(email => {
      if (email !== null) {
        const validCart = this.cartItems.map(({ quantity, ...validProps }) => validProps);
        const orderData = {
          id_User: email,
          id_Order_Status: 4,
          date: new Date(),
          books: JSON.stringify(validCart),
          total: this.totalAmount,
          books_amount: this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
        };

        this.orderService.createOrder(orderData).subscribe(response => {
          console.log('Order created successfully:', response);
          this.cartService.clearCart()
          this.router.navigate(['/dashboard']); 
        }, error => {
          console.error('Error creating order:', error);
        });
      } else {
        console.error('Error: Email is null, order not created');
      }
    });
  }
}