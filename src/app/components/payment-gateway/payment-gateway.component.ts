import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book.model';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  onAddressSubmit(form: any) {
    if (!form.valid){
      return;
    }
    this.showPaymentForm = true;
  }

  
  onPaymentSubmit() {
    this.authService.currentUserEmail().subscribe(email => {
      console.log('Email obtenido:', email);
      if (!email)  {
      console.error('Email is null, order not created');
      alert('Error: no se detectó el usuario.');
      return;
    }

    const validCart = this.cartItems.map(({ quantity, ...props }) => props);
    const orderData = {
      id_User: email, // debe existir en UsersLibroteka
      id_Order_Status: 1, // ID de "Pendiente", por ejemplo
      date: new Date(),
      books: validCart, // sin stringify
      total: this.totalAmount,
      books_amount: this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
    };

    console.log("Order payload:", orderData);

    this.orderService.createOrder(orderData).subscribe({
      next: res => {
        console.log('Order created successfully:', res);
        this.cartService.clearCart();
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('Error creating order:', err);
      }
    });
  });
  }
  

  
}
